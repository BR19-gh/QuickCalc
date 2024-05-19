import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, SafeAreaView, Text } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { useState, useEffect } from "react";
import { lang } from "../../../helpers";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

function WalkThrough(props) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    props.setCurrentTitles(currentImage);
  }, [currentImage]);

  const IMGS =
    lang === "ar"
      ? Platform.OS === "macos"
        ? [
            require(`../../../../walkthro_ar/welcome.png`),
            require(`../../../../walkthro_ar/home.png`),
            require(`../../../../walkthro_ar/edit.gif`),
            require(`../../../../walkthro_ar/hidden.png`),
            require(`../../../../walkthro_ar/settings.png`),
          ]
        : [
            require(`../../../../walkthro_ar/welcome.png`),
            require(`../../../../walkthro_ar/home.png`),
            require(`../../../../walkthro_ar/home_menu.png`),
            require(`../../../../walkthro_ar/edit.gif`),
            require(`../../../../walkthro_ar/hidden.png`),
            require(`../../../../walkthro_ar/home_swipe.gif`),
            require(`../../../../walkthro_ar/settings.png`),
          ]
      : Platform.OS === "macos"
      ? [
          require(`../../../../walkthro_en/welcome.png`),
          require(`../../../../walkthro_en/home.png`),
          require(`../../../../walkthro_en/edit.gif`),
          require(`../../../../walkthro_en/hidden.png`),
          require(`../../../../walkthro_en/settings.png`),
        ]
      : [
          require(`../../../../walkthro_en/welcome.png`),
          require(`../../../../walkthro_en/home.png`),
          require(`../../../../walkthro_en/home_menu.png`),
          require(`../../../../walkthro_en/edit.gif`),
          require(`../../../../walkthro_en/hidden.png`),
          require(`../../../../walkthro_en/home_swipe.gif`),
          require(`../../../../walkthro_en/settings.png`),
        ];

  const selectImg = (dir) => {
    if (dir === "next") {
      setCurrentImage(currentImage === IMGS.length - 1 ? 0 : currentImage + 1);
    } else {
      setCurrentImage(currentImage === 0 ? IMGS.length - 1 : currentImage - 1);
    }
  };

  return (
    <SafeAreaView className="items-center">
      <View>
        <Image
          style={{
            width: 290,
            height: 613,
          }}
          source={IMGS[currentImage]}
        />
        <View className={"flex-row-reverse items-center justify-around mt-5"}>
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
            {currentImage + 1}/{IMGS.length}
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
