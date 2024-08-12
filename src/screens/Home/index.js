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
  ScrollView,
} from "react-native";
import Card from "../../components/Home/Card";
import SwipeableRow from "../../components/Home/Swipeable";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { handleInitialData } from "../../store/actions/shared";
import {
  handleEditVisTools,
  handleReorderTools,
  handleFavoriteTools,
} from "../../store/actions/tools";
import styles from "./styles";
import { connect } from "react-redux";

import {
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";

import { useTranslation } from "react-i18next";

import SelectDropdown from "react-native-select-dropdown";
import ContextMenu from "react-native-context-menu-view";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";

import { lang } from "../../helpers";

import {
  isDontShowAgain,
  setDontShowAgain,
  setQuickAccessToolId,
} from "../../../_DATA";
import InlineAd from "../../components/InlineAd/InlineAd";
import { showAd, loadAd } from "../../components/InterstitialAd";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { getAppIcon, setAppIcon } from "expo-dynamic-app-icon";

function Home(props) {
  useEffect(() => {
    loadAd(); // Load the ad when the component mounts
  }, []);

  useEffect(() => {
    if (true /*user.golden*/ === false) {
      console.log("appIcon", getAppIcon());
      if (getAppIcon() === "DEFAULT") return;
      setAppIcon("original");
    }
  }, []);

  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [props.theme]);

  const { t } = useTranslation();
  const text = (text) => "screens.Home.text." + text;
  const [refreshing, setRefreshing] = useState(false);

  const toast = useToast();

  const [yourToolsDisplayes, setYourToolsDisplayes] = useState(false);
  const [builtinToolsDisplayes, setBuiltinToolsDisplayes] = useState(false);

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
            isShowedFavorite={props.isShowedFavorite}
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
          />
        ) : (
          <SwipeableRow
            index={getIndex()}
            isShowedFavorite={props.isShowedFavorite}
            isEditingFavorite={props.isEditingFavorite}
            isEditing={props.isEditing}
            handleFavorite={handleFavorite}
            changeVis={changeVis}
            tool={tool}
            t={t}
          >
            <ContextMenu
              dropdownMenuMode={false}
              actions={
                props.isShowedFavorite
                  ? tool.link === "CreatedTool"
                    ? [
                        {
                          title: tool.isFavorite
                            ? t(text("unfavorite2"))
                            : t(text("favorite")),
                          systemIcon: tool.isFavorite ? "star.slash" : "star",
                        },

                        { title: t(text("hide")), systemIcon: "eye.slash" },
                        {
                          title: t(text("share")),
                          systemIcon: "square.and.arrow.up",
                        },
                        {
                          title: t(text("enableQuickAccess")),
                          systemIcon: "arrow.forward.to.line.circle",
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
                          title: t(text("enableQuickAccess")),
                          systemIcon: "arrow.forward.to.line.circle",
                        },
                      ]
                  : tool.link === "CreatedTool"
                  ? [
                      {
                        title: tool.isFavorite
                          ? t(text("unfavorite2"))
                          : t(text("favorite")),
                        systemIcon: tool.isFavorite ? "star.slash" : "star",
                      },

                      { title: t(text("hide")), systemIcon: "eye.slash" },
                      {
                        title: t(text("move")),
                        systemIcon:
                          "arrow.up.and.down.and.arrow.left.and.right",
                      },
                      {
                        title: t(text("share")),
                        systemIcon: "square.and.arrow.up",
                      },
                      {
                        title: t(text("enableQuickAccess")),
                        systemIcon: "arrow.forward.to.line.circle",
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
                        systemIcon:
                          "arrow.up.and.down.and.arrow.left.and.right",
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
                } else if (e.nativeEvent.name === t(text("move"))) {
                  if (props.isShowedFavorite) {
                    null;
                  } else {
                    props.setIsEditing(true);
                    props.setSearchText("");
                    props.searchBarRef.current.clearText();
                    props.searchBarRef.current.blur();
                    props.setMoving(true);
                  }
                } else if (e.nativeEvent.name === t(text("share"))) {
                  Haptics.selectionAsync();

                  shareText(JSON.stringify(tool));
                } else if (
                  e.nativeEvent.name === t(text("enableQuickAccess"))
                ) {
                  if (true /*user.golden*/) {
                    Haptics.selectionAsync();
                    changeQuickAccess(tool.id);
                  } else {
                    navigation.navigate("Paywall");
                  }
                }
              }}
            >
              <Card
                isEditingFavorite={props.isEditingFavorite}
                handleFavorite={handleFavorite}
                isShowedFavorite={props.isShowedFavorite}
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
              />
            </ContextMenu>
          </SwipeableRow>
        )}
      </ScaleDecorator>
    );
  };
  const renderItemDrag = ({ tool, getIndex, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <SwipeableRow
          index={getIndex()}
          isShowedFavorite={props.isShowedFavorite}
          isEditingFavorite={props.isEditingFavorite}
          isEditing={props.isEditing}
          handleFavorite={handleFavorite}
          changeVis={changeVis}
          tool={tool}
          t={t}
        >
          <Card
            searchTextLength={props.searchText.length}
            isEditingFavorite={props.isEditingFavorite}
            handleFavorite={handleFavorite}
            isShowedFavorite={props.isShowedFavorite}
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
          />
        </SwipeableRow>
      </ScaleDecorator>
    );
  };

  useEffect(() => {
    if (props.searchText.length > 0 || props.isEditing === true) {
      setYourToolsDisplayes(false);
      setBuiltinToolsDisplayes(false);
    }
  }, [props.isEditing, props.searchText]);

  const windowHight = Dimensions.get("window").height;

  const { user } = useRevenueCat();

  // //show ads
  // const handleAdClosed = () => {
  //   setTimeout(() => {
  //     showAd(handleAdClosed);
  //   }, 60000 * 3);
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     try {
  //       showAd(handleAdClosed);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }, 30000);
  // }, []);

  return (
    <SafeAreaView>
      <NestableScrollContainer
        style={{
          width: "100%",
          height: true /*user.golden*/
            ? "100%"
            : windowHight > 667
            ? windowHight > 852
              ? "92%"
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
          {props.searchText.length > 0 || props.isEditing === true ? (
            <View
              style={{
                alignSelf: "center",
                width: 135,
                height: 30,
                marginBottom: 10,
                marginTop: 10,
                backgroundColor: props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: props.theme === "dark" ? "#ffffffAA" : "#00000088",
                }}
              >
                {t(text("filterIsDisabled"))}
              </Text>
            </View>
          ) : (
            <SelectDropdown
              disabled={props.searchText.length > 0 || props.isEditing === true}
              data={[
                t(text("allTools")),
                t(text("yourTools")),
                t(text("builtinTools")),
              ]}
              defaultValue={t(text("allTools"))}
              onSelect={(selectedItem, index) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                if (index === 0) {
                  setYourToolsDisplayes(false);
                  setBuiltinToolsDisplayes(false);
                } else if (index === 1) {
                  setYourToolsDisplayes(true);
                  setBuiltinToolsDisplayes(false);
                } else if (index === 2) {
                  setYourToolsDisplayes(false);
                  setBuiltinToolsDisplayes(true);
                }
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View
                    style={{
                      alignSelf: "center",
                      width: 135,
                      height: 30,
                      marginBottom: 10,
                      marginTop: 10,
                      backgroundColor:
                        props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                      borderRadius: 8,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: props.theme === "dark" ? "#fff" : "#151E26",
                        flex: 1,
                        fontSize: 18,
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      {selectedItem}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      className="text-center"
                      style={{
                        flex: 1,
                        fontSize: 18,
                        fontWeight: "300",
                        color: props.theme === "dark" ? "#fff" : "#151E26",
                        ...(isSelected && {
                          fontWeight: "bold",
                          fontSize: 18,
                        }),
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                marginStart: -7,
                marginEnd: -7,
                backgroundColor: props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                borderRadius: 8,
                width: 150,
              }}
            />
          )}
          <Text
            className={styles.title + (props.theme === "dark" && " text-white")}
          >
            {props.isShowedFavorite
              ? t(text("favoredTools"))
              : t(text("tools"))}
          </Text>
        </View>
        {
          //shown tools
          props.isShowedFavorite ? (
            currentTools.filter((tool) => tool.isFavorite === true).length ===
            0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFavoredTools"))}
              </Text>
            ) : currentTools.filter((tool) =>
                yourToolsDisplayes
                  ? tool.link === "CreatedTool" &&
                    tool.isHidden === false &&
                    tool.isFavorite === true
                  : builtinToolsDisplayes
                  ? tool.link !== "CreatedTool" &&
                    tool.isHidden === false &&
                    tool.isFavorite === true
                  : true
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
              yourToolsDisplayes
                ? tool.link === "CreatedTool" && tool.isHidden === false
                : builtinToolsDisplayes
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
              ? props.isShowedFavorite
                ? currentTools.filter(
                    (tool) =>
                      tool.searchName.includes(props.searchText) &&
                      tool.isFavorite === true
                  )
                : currentTools.filter(
                    (tool) =>
                      tool.searchName.includes(props.searchText) &&
                      tool.isHidden === false
                  )
              : props.isShowedFavorite
              ? currentTools.filter((tool) =>
                  yourToolsDisplayes
                    ? tool.link === "CreatedTool" && tool.isFavorite === true
                    : (builtinToolsDisplayes
                        ? tool.link !== "CreatedTool" &&
                          tool.isFavorite === true
                        : true && tool.isFavorite === true) &&
                      tool.isFavorite === true
                )
              : currentTools.filter((tool) =>
                  yourToolsDisplayes
                    ? tool.link === "CreatedTool" && tool.isHidden === false
                    : (builtinToolsDisplayes
                        ? tool.link !== "CreatedTool" && tool.isHidden === false
                        : true && tool.isHidden === false) &&
                      tool.isHidden === false
                )
          }
          onDragEnd={({ data }) => {
            props.isShowedFavorite || props.searchText.length > 0
              ? null
              : handleReorder([
                  ...data,
                  ...currentTools.filter((tool) => tool.isHidden === true),
                ]);
          }}
          className={
            props.isEditing || props.isEditingFavorite ? "" : " h-full"
          }
          renderItem={({ item: tool, getIndex, drag, isActive }) => {
            if (props.isEditing || props.isEditingFavorite) {
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
          (props.isEditing || props.isEditingFavorite) && (
            <View
              className={
                "bg-slate-300 pb-4" +
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
                {props.isShowedFavorite
                  ? t(text("unfavoredTools"))
                  : t(text("hiddenTools"))}
              </Text>
              {currentTools.filter((tool) =>
                props.isShowedFavorite
                  ? tool.isFavorite === false && tool.isHidden === false
                  : tool.isHidden === true
              ).length !== 0 ? (
                currentTools
                  .filter((tool) =>
                    props.searchText.length > 0
                      ? tool.searchName.includes(props.searchText) &&
                        (props.isShowedFavorite
                          ? tool.isFavorite === false && tool.isHidden === false
                          : tool.isHidden === true)
                      : props.isShowedFavorite
                      ? tool.isFavorite === false &&
                        tool.isHidden === false &&
                        (yourToolsDisplayes
                          ? tool.link === "CreatedTool"
                          : builtinToolsDisplayes
                          ? tool.link !== "CreatedTool"
                          : true)
                      : tool.isHidden === true
                  )
                  .map((tool) => (
                    <Card
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
                    />
                  ))
              ) : (
                <Text
                  className={
                    "text-xl m-4 mt-0 text-gray-600 text-left" +
                    (props.theme === "dark" && " text-gray-400")
                  }
                >
                  {props.isShowedFavorite
                    ? t(text("noUnfavoredTools"))
                    : t(text("noHiddenTools"))}
                </Text>
              )}
            </View>
          )
        }
      </NestableScrollContainer>
      <View
        style={{
          top: windowHight > 667 ? (windowHight > 852 ? 1025 : 715) : 559,
          position: "absolute",
        }}
      >
        {true /*user.golden*/ ? null : <InlineAd /> ? <InlineAd /> : null}
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
