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

import { useColorScheme } from "react-native";

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
  const theme = useColorScheme();

  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [theme]);

  const { t } = useTranslation();
  const text = (text) => "screens.Home.text." + text;

  const navigation = useNavigation();

  const handleFavorite = (id) => {
    let newData = [...Object.values(props.tools)];
    const oldData = [...Object.values(props.tools)];

    newData.forEach((item) => {
      if (item.id === id) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite === true) {
          item.isHidden = false;
        }
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

      props.dispatch(handleEditVisTools(newData, oldData));
    }
  };

  return (
    <SafeAreaView>
      <NestableScrollContainer className="h-full">
        <Text className={styles.title + (theme === "dark" && " text-white")}>
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
                  "text-xl m-4 mt-0 text-left" +
                  (theme === "dark" && " text-white")
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
                "text-xl m-4 mt-0 text-left" +
                (theme === "dark" && " text-white")
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
                    theme={theme}
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
          }}
          keyExtractor={(tool) => tool.id.toString()}
        />

        {
          //not shown tools
          (props.isEditing || props.isEditingFavorite) && (
            <View
              className={
                "bg-slate-300 pb-4" + (theme === "dark" && " bg-slate-950")
              }
            >
              <Text
                className={
                  styles.title +
                  (theme === "dark" ? "  text-gray-400" : "  text-gray-600")
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
                      theme={theme}
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
                    (theme === "dark" && " text-gray-400")
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
