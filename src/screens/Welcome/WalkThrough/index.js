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

function WalkThrough(props) {
  const [currentImage, setCurrentImage] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    props.setCurrentTitles(currentImage);
  }, [currentImage]);

  const IMGS =
    lang === "ar"
      ? Platform.isPad
        ? [
            require(`../../../../walkthro_ar/welcome.png`),
            require(`../../../../walkthro_ar/home.png`),
            require(`../../../../walkthro_ar/edit.gif`),
            require(`../../../../walkthro_ar/hidden.png`),
            require(`../../../../walkthro_ar/settings.png`),
            require(`../../../../walkthro_ar/final.png`),
          ]
        : [
            require(`../../../../walkthro_ar/welcome.png`),
            require(`../../../../walkthro_ar/home.png`),
            require(`../../../../walkthro_ar/home_menu.png`),
            require(`../../../../walkthro_ar/edit.gif`),
            require(`../../../../walkthro_ar/hidden.png`),
            require(`../../../../walkthro_ar/home_swipe.gif`),
            require(`../../../../walkthro_ar/settings.png`),
            require(`../../../../walkthro_ar/final.png`),
          ]
      : Platform.isPad
      ? [
          require(`../../../../walkthro_en/welcome.png`),
          require(`../../../../walkthro_en/home.png`),
          require(`../../../../walkthro_en/edit.gif`),
          require(`../../../../walkthro_en/hidden.png`),
          require(`../../../../walkthro_en/settings.png`),
          require(`../../../../walkthro_en/final.png`),
        ]
      : [
          require(`../../../../walkthro_en/welcome.png`),
          require(`../../../../walkthro_en/home.png`),
          require(`../../../../walkthro_en/home_menu.png`),
          require(`../../../../walkthro_en/edit.gif`),
          require(`../../../../walkthro_en/hidden.png`),
          require(`../../../../walkthro_en/home_swipe.gif`),
          require(`../../../../walkthro_en/settings.png`),
          require(`../../../../walkthro_en/final.png`),
        ];

  const selectImg = (dir) => {
    if (dir === "next") {
      setCurrentImage(currentImage === IMGS.length - 1 ? 0 : currentImage + 1);
    } else {
      setCurrentImage(currentImage === 0 ? IMGS.length - 1 : currentImage - 1);
    }
  };

  const windowHight = Dimensions.get("window").height;

  const [orientation, setOrientation] = useState("PORTRAIT");

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
      <View className={"w-full h-full items-center"}>
        <Image
          style={{
            width: windowHight > 667 ? (windowHight > 852 ? 450 : 285) : 225,
            height: props.isFirstTimeLaunch
              ? windowHight > 667
                ? windowHight > 852
                  ? 1000
                  : 640
                : 510
              : windowHight > 667
              ? windowHight > 852
                ? 980
                : 615
              : 490,
          }}
          source={IMGS[currentImage]}
        />
        <View
          className={"flex-row-reverse w-full items-center justify-around mt-5"}
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
              size={32}
              colors={
                currentImage === IMGS.length - 1 ? ["#3B82F655"] : ["#3B82F6"]
              }
            />
          </TouchableOpacity>
          <Text className="text-xl text-center text-gray-500">
            {currentImage + 1}
            {" " + t("screens.Welcome.text.of") + " "}
            {IMGS.length}
          </Text>
          <TouchableOpacity
            disabled={currentImage === 0}
            onPress={() => {
              selectImg("prev");
              Haptics.selectionAsync();
            }}
          >
            <SweetSFSymbol
              name={lang === "ar" ? "chevron.right" : "chevron.left"}
              size={32}
              colors={currentImage === 0 ? ["#3B82F655"] : ["#3B82F6"]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default WalkThrough;
