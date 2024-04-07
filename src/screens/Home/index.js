import { Text, View, SafeAreaView } from "react-native";
import Card from "../../components/Home/Card";
import SwipeableRow from "../../components/Home/Swipeable";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
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
import { NativeModules } from "react-native";

import ContextMenu from "react-native-context-menu-view";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";

const deviceLanguage =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

let lang;
let str = deviceLanguage;
let match = str.match(/^([a-z]{2})/i);
if (match) {
  lang = match[0];
} else {
  lang = "en";
}

function Home(props) {
  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [props.theme]);

  const { t } = useTranslation();
  const text = (text) => "screens.Home.text." + text;

  const toast = useToast();

  const navigation = useNavigation();

  const handleFavorite = (id) => {
    const newData = [...Object.values(props.tools)];
    const oldData = [...Object.values(props.tools)];
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
    const oldData = [...Object.values(props.tools)];
    props.dispatch(handleReorderTools(data, oldData));
  };

  const changeVis = (id) => {
    const newData = [...Object.values(props.tools)];
    const oldData = [...Object.values(props.tools)];
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

  const renderItemContextMenu = ({ tool, getIndex, drag, isActive }) => {
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
          <ContextMenu
            dropdownMenuMode={false}
            actions={
              props.isShowedFavorite
                ? [
                    {
                      title: tool.isFavorite
                        ? t(text("unfavorite2"))
                        : t(text("favorite")),
                      systemIcon: tool.isFavorite
                        ? "star.slash.fill"
                        : "star.fill",
                    },
                    { title: t(text("hide")), systemIcon: "eye.slash.fill" },
                  ]
                : [
                    {
                      title: tool.isFavorite
                        ? t(text("unfavorite2"))
                        : t(text("favorite")),
                      systemIcon: tool.isFavorite
                        ? "star.slash.fill"
                        : "star.fill",
                    },
                    { title: t(text("hide")), systemIcon: "eye.slash.fill" },
                    {
                      title: t(text("move")),
                      systemIcon: "arrow.up.and.down.and.arrow.left.and.right",
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
            />
          </ContextMenu>
        </SwipeableRow>
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
          />
        </SwipeableRow>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView>
      <NestableScrollContainer className="h-full">
        <Text
          className={styles.title + (props.theme === "dark" && " text-white")}
        >
          {props.isShowedFavorite ? t(text("favoredTools")) : t(text("tools"))}
        </Text>

        {
          //shown tools
          props.isShowedFavorite ? (
            Object.values(props.tools).filter(
              (tool) => tool.isFavorite === true
            ).length === 0 ? (
              <Text
                className={
                  "text-xl m-4 mt-0 text-left " +
                  (props.theme === "dark" && " text-white")
                }
              >
                {t(text("noFavoredTools"))}
              </Text>
            ) : null
          ) : Object.values(props.tools).filter(
              (tool) => tool.isHidden === false
            ).length === 0 ? (
            <Text
              className={
                "text-xl m-4 mt-0 text-left " +
                (props.theme === "dark" && " text-white")
              }
            >
              {t(text("noTools"))}
            </Text>
          ) : null
        }

        <NestableDraggableFlatList
          data={
            props.isShowedFavorite
              ? Object.values(props.tools).filter(
                  (tool) => tool.isFavorite === true
                )
              : Object.values(props.tools).filter(
                  (tool) => tool.isHidden === false
                )
          }
          onDragEnd={({ data }) => {
            props.isShowedFavorite
              ? null
              : handleReorder([
                  ...data,
                  ...Object.values(props.tools).filter(
                    (tool) => tool.isHidden === true
                  ),
                ]);
          }}
          className={
            "mb-4" +
            (props.isEditing || props.isEditingFavorite ? "" : " h-full")
          }
          renderItem={({ item: tool, getIndex, drag, isActive }) => {
            if (props.isEditing || props.isEditingFavorite) {
              return renderItemDrag({ tool, getIndex, drag, isActive });
            } else {
              return renderItemContextMenu({ tool, getIndex, drag, isActive });
            }
          }}
          keyExtractor={(tool) => tool.id.toString()}
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
              {Object.values(props.tools).filter((tool) =>
                props.isShowedFavorite
                  ? tool.isFavorite === false && tool.isHidden === false
                  : tool.isHidden === true
              ).length !== 0 ? (
                Object.values(props.tools)
                  .filter((tool) =>
                    props.isShowedFavorite
                      ? tool.isFavorite === false && tool.isHidden === false
                      : tool.isHidden === true
                  )
                  .map((tool) => (
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
    </SafeAreaView>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Home);
