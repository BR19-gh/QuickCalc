import {
  Text,
  View,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  Platform,
  Alert,
  Share,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Card from "../../components/Home/Card";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { handleInitialData } from "../../store/actions/shared";
import {
  handleEditVisTools,
  handleReorderTools,
  handleFavoriteTools,
  handleDeleteTool,
} from "../../store/actions/tools";
import styles from "./styles";
import { connect } from "react-redux";

import {
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";

import { useTranslation } from "react-i18next";

import ContextMenu from "react-native-context-menu-view";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";

import { lang } from "../../helpers";

import {
  isDontShowAgain,
  setDontShowAgain,
  setQuickAccessToolId,
  getNoteId,
  setNoteId,
} from "../../../_DATA";
import InlineAd from "../../components/InlineAd/InlineAd";
import { showAd, loadAd } from "../../components/InterstitialAd";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { getAppIconName, setAlternateAppIcon } from "expo-alternate-app-icons";

import SweetSFSymbol from "sweet-sfsymbols";

function Home(props) {
  const [noteIdState, setNoteIdState] = useState("");

  useEffect(() => {
    const getNoteIdFun = async () => {
      const noteId = await getNoteId();
      console.log("noteId: ", noteId);
      setNoteIdState(noteId);
    };

    getNoteIdFun();
  }, []);

  useEffect(() => {
    if (noteIdState !== "") {
      fetch("https://br19.pythonanywhere.com/getNote")
        .then((response) => response.json())
        .then((data) => {
          if (data.note !== undefined && data.id !== noteIdState) {
            setNoteId(data.id);
            navigation.navigate("Note", {
              note: data.note,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [noteIdState]);

  useEffect(() => {
    loadAd(); // Load the ad when the component mounts
    if (user.golden === false) {
      console.log("appIcon Before: ", getAppIconName());
      if (
        getAppIconName() === "darkIcon" ||
        getAppIconName() === null ||
        getAppIconName() === "tinted"
      ) {
        return;
      }
      const setAppIcon = async () => {
        await setAlternateAppIcon(null);
      };

      setAppIcon();

      console.log("appIcon After: ", getAppIconName());
    }
  }, []);

  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [props.theme]);

  const { t } = useTranslation();
  const text = (text) => "screens.Home.text." + text;
  const [refreshing, setRefreshing] = useState(false);

  const toast = useToast();

  const navigation = useNavigation();

  const handleFavorite = (id) => {
    const newData = [...currentTools];
    const oldData = [...currentTools];
    let changedIndex = -1;

    newData.forEach((item, index) => {
      if (item.id === id) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite === true) {
          item.isHidden = false;
        }
        changedIndex = index;
      }
    });

    props.dispatch(handleFavoriteTools(newData, oldData));
    props.dispatch(handleInitialData());
  };

  const handleReorder = (data) => {
    const oldData = [...currentTools];
    props.dispatch(handleReorderTools(data, oldData));
  };

  const changeVis = (id) => {
    const newData = [...currentTools];
    const oldData = [...currentTools];
    let changedIndex = -1;

    newData.forEach((item, index) => {
      if (item.id === id) {
        item.isHidden = !item.isHidden;
        if (item.isHidden === true) {
          item.isFavorite = false;
        }
        changedIndex = index;
      }
    });

    if (changedIndex !== -1) {
      const changedItem = newData.splice(changedIndex, 1)[0];

      if (changedItem.isHidden) {
        newData.push(changedItem);
      } else {
        newData.unshift(changedItem);
      }
    }

    props.dispatch(handleEditVisTools(newData, oldData));
  };

  const [currentTools, setCurrentTools] = useState([]);

  useEffect(() => {
    const uniqueTools = [...Object.values(props.tools)].filter(
      (tool, index, self) => index === self.findIndex((t) => t.id === tool.id)
    );

    if (Object.keys(props.tools).length !== 0) {
      props.setCurrentTools(props.tools);
    }
    setCurrentTools(uniqueTools);
  }, [props.tools]);

  const shareText = async (code) => {
    if (await isDontShowAgain()) {
      try {
        await Share.share({
          message: code,
        });
      } catch (error) {
        alert("Error while sharing: " + error.message);
      }
    } else {
      Alert.alert(
        `${t(text("toolHasBeenShared"))}`,
        t(text("toolHasBeenSharedMsg")),
        [
          {
            text: t(text("gotIt")),
            style: "default",
            onPress: async () => {
              try {
                await Share.share({
                  message: code,
                });
              } catch (error) {
                alert("Error while sharing: " + error.message);
              }
            },
          },
          {
            text: t(text("dontShowAgain")),
            style: "cancel",
            onPress: async () => {
              await setDontShowAgain();
              shareText(code);
            },
          },
        ]
      );
    }
  };

  const changeQuickAccess = async (id) => {
    await setQuickAccessToolId(id);
    toast.show(t(text("toolAssigned")), {
      duration: 1000,
      type: "success",
      placement: "top",
    });
  };

  const renderItemContextMenu = ({ tool, getIndex, drag, isActive }) => {
    return (
      <ScaleDecorator>
        {Platform.isPad ? (
          <Card
            isEditingFavorite={props.isEditingFavorite}
            handleFavorite={handleFavorite}
            theme={props.theme}
            lang={lang}
            tool={tool}
            key={tool.id}
            changeVis={changeVis}
            navigation={navigation}
            isEditing={props.isEditing}
            drag={drag}
            isActive={isActive}
            t={t}
            text={text}
            moving={props.moving}
            handleDelete={handleDelete}
          />
        ) : (
          <ContextMenu
            style={{
              width: "92%",
              alignSelf: "center",
              marginBottom: 5,
            }}
            dropdownMenuMode={false}
            actions={
              tool.link === "CreatedTool"
                ? [
                    {
                      title: tool.isFavorite
                        ? t(text("unfavorite2"))
                        : t(text("favorite")),
                      systemIcon: tool.isFavorite ? "star.slash" : "star",
                    },

                    { title: t(text("hide")), systemIcon: "eye.slash" },
                    {
                      title: t(text("edit")),
                      systemIcon: "square.and.pencil",
                    },
                    {
                      title: t(text("move")),
                      systemIcon: "arrow.up.and.down.and.arrow.left.and.right",
                    },
                    {
                      title: t(text("share")),
                      systemIcon: "square.and.arrow.up",
                    },
                    {
                      title: t(text("enableQuickAccess")),
                      systemIcon: "arrow.forward.to.line.circle",
                    },
                    {
                      title: t("screens.Home.CreatedTool.Header.delete"),
                      systemIcon: "trash",
                      destructive: true,
                    },
                  ]
                : [
                    {
                      title: tool.isFavorite
                        ? t(text("unfavorite2"))
                        : t(text("favorite")),
                      systemIcon: tool.isFavorite ? "star.slash" : "star",
                    },
                    { title: t(text("hide")), systemIcon: "eye.slash" },
                    {
                      title: t(text("move")),
                      systemIcon: "arrow.up.and.down.and.arrow.left.and.right",
                    },
                    {
                      title: t(text("enableQuickAccess")),
                      systemIcon: "arrow.forward.to.line.circle",
                    },
                  ]
            }
            onPress={(e) => {
              if (
                e.nativeEvent.name === t(text("favorite")) ||
                e.nativeEvent.name === t(text("unfavorite2"))
              ) {
                handleFavorite(tool.id);
                if (tool.isFavorite) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  toast.show(t(text("toolHasbeenFavored")), {
                    type: "success",
                    placement: "top",
                    duration: 1000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                } else if (!tool.isFavorite) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  toast.show(t(text("toolHasbeenUnFavored")), {
                    type: "success",
                    placement: "top",
                    duration: 1000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                } else {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                  );
                  toast.show(t(text("errorFavoriting")), {
                    type: "warning",
                    placement: "top",
                    duration: 4000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                }
              } else if (e.nativeEvent.name === t(text("hide"))) {
                changeVis(tool.id);
                if (tool.isHidden) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  toast.show(t(text("toolHasBeenHidden")), {
                    type: "success",
                    placement: "top",
                    duration: 1000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                } else {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                  );
                  toast.show(t(text("errorHiding")), {
                    type: "warning",
                    placement: "top",
                    duration: 4000,
                    offset: 20,
                    animationType: "zoom-in",
                  });
                }
              } else if (e.nativeEvent.name === t(text("edit"))) {
                if (
                  user.golden ||
                  Object.values(props.tools).filter(
                    (tool) => tool.link === "CreatedTool"
                  ).length <= 1
                ) {
                  Haptics.selectionAsync();
                  navigation.navigate("EditTool", {
                    tool: tool,
                  });
                } else {
                  navigation.navigate("Paywall");
                }
              } else if (e.nativeEvent.name === t(text("move"))) {
                props.setIsEditing(true);
                props.setSearchText("");
                props.searchBarRef.current.clearText();
                props.searchBarRef.current.blur();
                props.setMoving(true);
              } else if (e.nativeEvent.name === t(text("share"))) {
                Haptics.selectionAsync();

                shareText(JSON.stringify(tool));
              } else if (e.nativeEvent.name === t(text("enableQuickAccess"))) {
                if (user.golden) {
                  Haptics.selectionAsync();
                  changeQuickAccess(tool.id);
                } else {
                  navigation.navigate("Paywall");
                }
              } else if (
                e.nativeEvent.name ===
                t("screens.Home.CreatedTool.Header.delete")
              ) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning
                );
                Alert.alert(
                  t("screens.Home.CreatedTool.Header.deleteConfirmTitle"),
                  t(
                    "screens.Home.CreatedTool.Header.deleteConfirmMessage",
                    tool.name
                  ),
                  [
                    {
                      text: t("screens.Home.CreatedTool.Header.cancel"),
                      style: "cancel",
                      onPress: () => null,
                    },
                    {
                      text: t("screens.Home.CreatedTool.Header.delete"),
                      style: "destructive",
                      onPress: () => handleDelete(tool.id),
                    },
                  ]
                );
              }
            }}
          >
            <Card
              isEditingFavorite={props.isEditingFavorite}
              handleFavorite={handleFavorite}
              theme={props.theme}
              lang={lang}
              tool={tool}
              key={tool.id}
              changeVis={changeVis}
              navigation={navigation}
              isEditing={props.isEditing}
              drag={drag}
              isActive={isActive}
              t={t}
              text={text}
              moving={props.moving}
              handleDelete={handleDelete}
            />
          </ContextMenu>
        )}
      </ScaleDecorator>
    );
  };
  const renderItemDrag = ({ tool, getIndex, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View
          style={{
            width: "92%",
            alignSelf: "center",
            marginBottom: 5,
          }}
        >
          <Card
            index={getIndex()}
            searchTextLength={props.searchText.length}
            isEditingFavorite={props.isEditingFavorite}
            handleFavorite={handleFavorite}
            theme={props.theme}
            lang={lang}
            tool={tool}
            key={tool.id}
            changeVis={changeVis}
            navigation={navigation}
            isEditing={props.isEditing}
            drag={drag}
            isActive={isActive}
            t={t}
            text={text}
            moving={props.moving}
            handleDelete={handleDelete}
          />
        </View>
      </ScaleDecorator>
    );
  };

  useEffect(() => {
    if (props.isEditing === true) {
      props.setYourToolsDisplayes(false);
      props.setBuiltinToolsDisplayes(false);
      props.setIsShowedFavorite(false);
    }
  }, [props.isEditing]);

  const windowHight = Dimensions.get("window").height;

  const { user } = useRevenueCat();

  //show ads
  const handleAdClosed = () => {
    setTimeout(() => {
      showAd(handleAdClosed);
    }, 60000 * 3);
  };

  useEffect(() => {
    setTimeout(() => {
      try {
        showAd(handleAdClosed);
      } catch (e) {
        console.log(e);
      }
    }, 30000);
  }, []);

  const [orientation, setOrientation] = useState("");

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      props.dispatch(handleInitialData());
      if (width < height) {
        setOrientation("PORTRAIT");
      } else {
        setOrientation("LANDSCAPE");
      }
    });
  }, [orientation]);

  const styelForFiltersOuter = {
    alignSelf: "center",
    padding: 10,
    margin: 5,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: props.theme === "dark" ? "#2C2C2D" : "#E2E4E2",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };

  const styelForFiltersOuterSelected = {
    ...styelForFiltersOuter,
    backgroundColor: props.theme === "dark" ? "#11253F" : "#C8D9F3",
  };

  const styelForFiltersInner = {
    color: props.theme === "dark" ? "#9E9EA4" : "#6D6D6F",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  };

  const styelForFiltersInnerSelected = {
    ...styelForFiltersInner,
    color: props.theme === "dark" ? "#D6E7FB" : "#1A3C72",
  };

  const onSelect = (index) => {
    Haptics.selectionAsync();
    if (index === 0) {
      props.setYourToolsDisplayes(false);
      props.setBuiltinToolsDisplayes(false);
      props.setIsShowedFavorite(false);
    } else if (index === 1) {
      props.setYourToolsDisplayes(true);
      props.setBuiltinToolsDisplayes(false);
      props.setIsShowedFavorite(false);
    } else if (index === 2) {
      props.setYourToolsDisplayes(false);
      props.setBuiltinToolsDisplayes(true);
      props.setIsShowedFavorite(false);
    } else if (index === 3) {
      props.setYourToolsDisplayes(false);
      props.setBuiltinToolsDisplayes(false);
      props.setIsShowedFavorite(true);
      props.setIsEditingFavorite(false);
      props.setIsEditing(false);
    }
  };

  const handleDelete = (id) => {
    const newData = [...Object.values(props.tools)];
    const oldData = [...Object.values(props.tools)];

    newData.forEach((item, index) => {
      if (item.id === id) {
        newData.splice(index, 1);
      }
    });

    try {
      let refreshToast = toast.show(
        t("screens.Home.CreatedTool.Header.deletingTool"),
        {
          placement: "top",
          type: "normal",
        }
      );
      props.dispatch(handleDeleteTool(newData, oldData));

      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        toast.update(
          refreshToast,
          t("screens.Home.CreatedTool.Header.toolHasBeenDeleted"),
          {
            type: "success",
            duration: 4000,
            placement: "top",
          }
        );

        navigation.navigate("HomeNavi");
      }, 1000);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t("screens.Home.CreatedTool.Header.errorTitle"),
        error.message +
          "\n\n" +
          t("screens.Home.CreatedTool.Header.pleaseShareError")
      );
    }
  };

  return (
    <SafeAreaView>
      <NestableScrollContainer
        style={{
          width: "100%",
          height: user.golden
            ? "100%"
            : windowHight > 667
            ? windowHight > 852
              ? "92%"
              : Platform.isPad
              ? "88%"
              : "92%"
            : "90%",
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              let refreshToast = toast.show(t(text("refreshing")), {
                placement: "top",
              });
              props.dispatch(handleInitialData());
              setRefreshing(true);
              setTimeout(() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                toast.update(refreshToast, t(text("refreshComplated")), {
                  type: "success",
                  duration: 500,
                  placement: "top",
                });
                setRefreshing(false);
              }, 500);
            }}
          />
        }
      >
        <View>
          {props.isEditing === true ? (
            <View style={{ ...styelForFiltersOuter, width: 150 }}>
              <Text style={styelForFiltersInner}>
                {t(text("filterIsDisabled"))}
              </Text>
            </View>
          ) : (
            <View className="flex flex-row justify-center">
              <TouchableOpacity
                style={
                  props.yourToolsDisplayes === false &&
                  props.builtinToolsDisplayes === false &&
                  props.isShowedFavorite === false
                    ? styelForFiltersOuterSelected
                    : styelForFiltersOuter
                }
                activeOpacity={1}
                onPress={() => {
                  onSelect(0);
                }}
              >
                <Text
                  style={
                    props.yourToolsDisplayes === false &&
                    props.builtinToolsDisplayes === false &&
                    props.isShowedFavorite === false
                      ? styelForFiltersInnerSelected
                      : styelForFiltersInner
                  }
                >
                  {t(text("allTools"))}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  props.yourToolsDisplayes === true &&
                  props.builtinToolsDisplayes === false
                    ? styelForFiltersOuterSelected
                    : styelForFiltersOuter
                }
                activeOpacity={1}
                onPress={() => {
                  onSelect(1);
                }}
              >
                <Text
                  style={
                    props.yourToolsDisplayes === true &&
                    props.builtinToolsDisplayes === false
                      ? styelForFiltersInnerSelected
                      : styelForFiltersInner
                  }
                >
                  {t(text("yourTools"))}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  props.yourToolsDisplayes === false &&
                  props.builtinToolsDisplayes === true
                    ? styelForFiltersOuterSelected
                    : styelForFiltersOuter
                }
                activeOpacity={1}
                onPress={() => {
                  onSelect(2);
                }}
              >
                <Text
                  style={
                    props.yourToolsDisplayes === false &&
                    props.builtinToolsDisplayes === true
                      ? styelForFiltersInnerSelected
                      : styelForFiltersInner
                  }
                >
                  {t(text("builtin"))}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  props.isShowedFavorite === true
                    ? styelForFiltersOuterSelected
                    : styelForFiltersOuter
                }
                activeOpacity={1}
                onPress={() => {
                  onSelect(3);
                }}
              >
                <Text
                  style={
                    props.isShowedFavorite === true
                      ? styelForFiltersInnerSelected
                      : styelForFiltersInner
                  }
                >
                  {t(text("favorites"))}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text
            className={styles.title + (props.theme === "dark" && " text-white")}
          >
            {props.isShowedFavorite
              ? t(text("favoredTools"))
              : props.yourToolsDisplayes
              ? t(text("createdTools"))
              : props.builtinToolsDisplayes
              ? t(text("builtinTools"))
              : t(text("tools"))}
          </Text>
        </View>
        {
          //shown tools
          props.isShowedFavorite ? (
            currentTools.filter(
              (tool) => tool.isFavorite === true && tool.isHidden === false
            ).length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFavoredTools"))}
              </Text>
            ) : currentTools.filter(
                (tool) => tool.isFavorite === true && tool.isHidden === false
              ).length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFilteredFavoredTools"))}
              </Text>
            ) : null
          ) : props.yourToolsDisplayes ? (
            currentTools.filter((tool) => tool.link === "CreatedTool")
              .length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noCreatedTools"))}
              </Text>
            ) : currentTools.filter(
                (tool) => tool.link === "CreatedTool" && tool.isHidden === false
              ).length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFilteredCreatedTools"))}
              </Text>
            ) : null
          ) : props.builtinToolsDisplayes ? (
            currentTools.filter((tool) => tool.link !== "CreatedTool")
              .length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noBuiltinTools"))}
              </Text>
            ) : currentTools.filter(
                (tool) => tool.link !== "CreatedTool" && tool.isHidden === false
              ).length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFilteredBuiltinTools"))}
              </Text>
            ) : null
          ) : currentTools.filter((tool) => tool.isHidden === false).length ===
            0 ? (
            <Text
              className={
                "text-xl m-4 mt-0 text-left " +
                (props.theme === "dark" && " text-white")
              }
            >
              {t(text("noTools"))}
            </Text>
          ) : currentTools.filter((tool) =>
              props.yourToolsDisplayes
                ? tool.link === "CreatedTool" && tool.isHidden === false
                : props.builtinToolsDisplayes
                ? tool.link !== "CreatedTool" && tool.isHidden === false
                : true
            ).length === 0 ? (
            <Text
              className={
                "text-xl m-4 mt-0 text-left " +
                (props.theme === "dark" && " text-white")
              }
            >
              {t(text("noFilteredTools"))}
            </Text>
          ) : null
        }

        <NestableDraggableFlatList
          extraData={currentTools}
          contentInsetAdjustmentBehavior="automatic"
          data={
            props.searchText.length > 0
              ? currentTools.filter(
                  (tool) =>
                    tool.searchName.includes(props.searchText) &&
                    (props.yourToolsDisplayes
                      ? tool.link === "CreatedTool" && tool.isHidden === false
                      : props.isShowedFavorite
                      ? tool.isFavorite && tool.isHidden === false
                      : (props.builtinToolsDisplayes
                          ? tool.link !== "CreatedTool" &&
                            tool.isHidden === false
                          : true && tool.isHidden === false) &&
                        tool.isHidden === false)
                )
              : currentTools.filter((tool) =>
                  props.yourToolsDisplayes
                    ? tool.link === "CreatedTool" && tool.isHidden === false
                    : props.isShowedFavorite
                    ? tool.isFavorite && tool.isHidden === false
                    : (props.builtinToolsDisplayes
                        ? tool.link !== "CreatedTool" && tool.isHidden === false
                        : true && tool.isHidden === false) &&
                      tool.isHidden === false
                )
          }
          onDragEnd={({ data }) => {
            props.searchText.length > 0
              ? null
              : handleReorder([
                  ...data,
                  ...currentTools.filter((tool) => tool.isHidden === true),
                ]);
          }}
          className={props.isEditing ? " pb-4" : " h-full pb-4"}
          renderItem={({ item: tool, getIndex, drag, isActive }) => {
            if (props.isEditing) {
              return renderItemDrag({ tool, getIndex, drag, isActive });
            } else {
              return renderItemContextMenu({
                tool,
                getIndex,
                drag,
                isActive,
              });
            }
          }}
          keyExtractor={(item, index) => String(index)}
        />

        {
          //not shown tools
          props.isEditing && (
            <View
              className={
                "bg-slate-300 pb-4 " +
                (props.theme === "dark" && " bg-slate-950")
              }
            >
              <Text
                className={
                  styles.title +
                  (props.theme === "dark"
                    ? "  text-gray-400"
                    : "  text-gray-600")
                }
              >
                {t(text("hiddenTools"))}
              </Text>
              {currentTools.filter((tool) => tool.isHidden === true).length !==
              0 ? (
                currentTools
                  .filter((tool) =>
                    props.searchText.length > 0
                      ? tool.searchName.includes(props.searchText) &&
                        tool.isHidden === true
                      : tool.isHidden === true
                  )
                  .map((tool, index) => (
                    <View
                      style={{
                        width: "92%",
                        alignSelf: "center",
                        marginBottom: 20,
                      }}
                    >
                      <Card
                        index={index}
                        searchTextLength={props.searchText.length}
                        isEditingFavorite={props.isEditingFavorite}
                        handleFavorite={handleFavorite}
                        theme={props.theme}
                        lang={lang}
                        tool={tool}
                        key={tool.id}
                        changeVis={changeVis}
                        navigation={navigation}
                        isEditing={props.isEditing}
                        t={t}
                        text={text}
                        handleDelete={handleDelete}
                      />
                    </View>
                  ))
              ) : (
                <Text
                  className={
                    "text-xl m-4 mt-0 text-gray-600 text-left" +
                    (props.theme === "dark" && " text-gray-400")
                  }
                >
                  {t(text("noHiddenTools"))}
                </Text>
              )}
            </View>
          )
        }
      </NestableScrollContainer>
      <View
        style={{
          top:
            windowHight > 667
              ? windowHight > 852
                ? 1025
                : Platform.isPad
                ? 664
                : 715
              : 559,
          position: "absolute",
        }}
      >
        {user.golden ? null : <InlineAd /> ? <InlineAd /> : null}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Home);
