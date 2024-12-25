import { StatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { useState, useEffect } from "react";
import { lang } from "../../../helpers";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";

function WalkThrough(props) {
  const [currentImage, setCurrentImage] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    props.setCurrentTitles(currentImage);
  }, [currentImage]);

  const IMGS =
    lang === "ar"
      ? Platform.isPad
        ? props.theme === "dark"
          ? [
              // Dark props.theme Arabic iPad
              require(`../../../../walkthrough/welcome_ar.png`),
              require(`../../../../walkthrough/home_ar_dark.jpeg`),
              require(`../../../../walkthrough/ipad_menu_ar_dark.png`),
              require(`../../../../walkthrough/edit_ar_dark.png`),
              require(`../../../../walkthrough/hidden_ar_dark.png`),
              require(`../../../../walkthrough/final_ar.png`),
            ]
          : [
              // Light props.theme Arabic iPad
              require(`../../../../walkthrough/welcome_ar.png`),
              require(`../../../../walkthrough/home_ar.png`),
              require(`../../../../walkthrough/ipad_menu_ar.png`),
              require(`../../../../walkthrough/edit_ar.png`),
              require(`../../../../walkthrough/hidden_ar.png`),
              require(`../../../../walkthrough/final_ar.png`),
            ]
        : props.theme === "dark"
        ? [
            // Dark props.theme Arabic iPhone
            require(`../../../../walkthrough/welcome_ar.png`),
            require(`../../../../walkthrough/home_ar_dark.jpeg`),
            require(`../../../../walkthrough/iphone_menu_ar_dark.png`),
            require(`../../../../walkthrough/edit_ar_dark.png`),
            require(`../../../../walkthrough/hidden_ar_dark.png`),
            require(`../../../../walkthrough/final_ar.png`),
          ]
        : [
            // Light props.theme Arabic iPhone
            require(`../../../../walkthrough/welcome_ar.png`),
            require(`../../../../walkthrough/home_ar.png`),
            require(`../../../../walkthrough/iphone_menu_ar.png`),
            require(`../../../../walkthrough/edit_ar.png`),
            require(`../../../../walkthrough/hidden_ar.png`),
            require(`../../../../walkthrough/final_ar.png`),
          ]
      : Platform.isPad
      ? props.theme === "dark"
        ? [
            // Dark props.theme English iPad
            require(`../../../../walkthrough/welcome_en.png`),
            require(`../../../../walkthrough/home_en_dark.png`),
            require(`../../../../walkthrough/ipad_menu_en_dark.png`),
            require(`../../../../walkthrough/edit_en_dark.png`),
            require(`../../../../walkthrough/hidden_en_dark.png`),
            require(`../../../../walkthrough/final_en.png`),
          ]
        : [
            // Light props.theme English iPad
            require(`../../../../walkthrough/welcome_en.png`),
            require(`../../../../walkthrough/home_en.png`),
            require(`../../../../walkthrough/ipad_menu_en.png`),
            require(`../../../../walkthrough/edit_en.png`),
            require(`../../../../walkthrough/hidden_en.png`),
            require(`../../../../walkthrough/final_en.png`),
          ]
      : props.theme === "dark"
      ? [
          // Dark props.theme English iPhone
          require(`../../../../walkthrough/welcome_en.png`),
          require(`../../../../walkthrough/home_en_dark.png`),
          require(`../../../../walkthrough/iphone_menu_en_dark.png`),
          require(`../../../../walkthrough/edit_en_dark.png`),
          require(`../../../../walkthrough/hidden_en_dark.png`),
          require(`../../../../walkthrough/final_en.png`),
        ]
      : [
          // Light props.theme English iPhone
          require(`../../../../walkthrough/welcome_en.png`),
          require(`../../../../walkthrough/home_en.png`),
          require(`../../../../walkthrough/iphone_menu_en.png`),
          require(`../../../../walkthrough/edit_en.png`),
          require(`../../../../walkthrough/hidden_en.png`),
          require(`../../../../walkthrough/final_en.png`),
        ];

  const selectImg = (dir) => {
    if (dir === "next") {
      setCurrentImage(currentImage === IMGS.length - 1 ? 0 : currentImage + 1);
    } else {
      setCurrentImage(currentImage === 0 ? IMGS.length - 1 : currentImage - 1);
    }
  };

  const windowHight = Dimensions.get("window").height;

  const [orientation, setOrientation] = useState("");

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      if (width < height) {
        setOrientation("PORTRAIT");
      } else {
        setOrientation("LANDSCAPE");
      }
    });
  }, [orientation]);

  return (
    <SafeAreaView className="items-center">
      <View
        className={
          "flex-row-reverse w-full flex-wrap items-center justify-around mt-5"
        }
      >
        <TouchableOpacity
          disabled={currentImage === IMGS.length - 1}
          onPress={() => {
            selectImg("next");
            Haptics.selectionAsync();
          }}
        >
          <SweetSFSymbol
            name={lang === "ar" ? "chevron.left" : "chevron.right"}
            size={52}
            colors={
              currentImage === IMGS.length - 1 ? ["#3B82F655"] : ["#3B82F6"]
            }
          />
        </TouchableOpacity>
        <Image
          style={{
            width: DeviceInfo.getModel().includes(
              "iPad Pro 12.9-inch (3rd generation)"
            )
              ? 342
              : windowHight > 667
              ? windowHight > 1000
                ? 450
                : Platform.isPad
                ? 270
                : 285
              : 225,
            height: DeviceInfo.getModel().includes(
              "iPad Pro 12.9-inch (3rd generation)"
            )
              ? 738
              : props.isFirstTimeLaunch
              ? windowHight > 667
                ? windowHight > 1000
                  ? 1000
                  : Platform.isPad
                  ? 575
                  : 640
                : 510
              : windowHight > 667
              ? windowHight > 1000
                ? 980
                : Platform.isPad
                ? 575
                : 615
              : 490,
          }}
          source={IMGS[currentImage]}
        />

        <TouchableOpacity
          disabled={currentImage === 0}
          onPress={() => {
            selectImg("prev");
            Haptics.selectionAsync();
          }}
        >
          <SweetSFSymbol
            name={lang === "ar" ? "chevron.right" : "chevron.left"}
            size={52}
            colors={currentImage === 0 ? ["#3B82F655"] : ["#3B82F6"]}
          />
        </TouchableOpacity>
        <Text className="text-xl w-full text-center text-gray-500">
          {currentImage + 1}
          {" " + t("screens.Welcome.text.of") + " "}
          {IMGS.length}
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default WalkThrough;
