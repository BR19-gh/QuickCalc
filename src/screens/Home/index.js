import { Text, View, SafeAreaView } from "react-native";
import Card from "../../components/Home/Card";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { handleInitialData } from "../../store/actions/shared";
import {
  handleEditVisTools,
  handleReorderTools,
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

console.log(lang);

function Home(props) {
  const theme = useColorScheme();

  useEffect(() => {
    props.dispatch(handleInitialData());
  }, [theme]);

  const { t } = useTranslation();
  const text = (text) => "screens.Home.text." + text;

  const navigation = useNavigation();

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
          {t(text("tools"))}
        </Text>

        {
          //shown tools
          Object.values(props.tools).filter((tool) => tool.isHidden === false)
            .length === 0 ? (
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
          data={Object.values(props.tools).filter(
            (tool) => tool.isHidden === false
          )}
          onDragEnd={({ data }) => {
            handleReorder([
              ...data,
              ...Object.values(props.tools).filter(
                (tool) => tool.isHidden === true
              ),
            ]);
          }}
          className={"mb-4" + (props.isEditing ? "" : " h-full")}
          renderItem={({ item: tool, drag, isActive }) => (
            <ScaleDecorator>
              <Card
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
            </ScaleDecorator>
          )}
          keyExtractor={(tool) => tool.id.toString()}
        />

        {
          //hidden tools
          props.isEditing && (
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
                {t(text("hiddenTools"))}
              </Text>
              {Object.values(props.tools).filter(
                (tool) => tool.isHidden === true
              ).length !== 0 ? (
                Object.values(props.tools)
                  .filter((tool) => tool.isHidden === true)
                  .map((tool) => (
                    <Card
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
                    (theme === "dark" && " text-white")
                  }
                >
                  {t(text("noHiddenTools"))}
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
