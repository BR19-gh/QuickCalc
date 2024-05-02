import { Animated, Touchable, TouchableOpacity } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SweetSFSymbol from "sweet-sfsymbols";
import React, { Component, createRef } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

import { useToast } from "react-native-toast-notifications";

import { NativeModules } from "react-native";

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

let row = [];
let prevOpenedRow;

function withHooks(WrappedComponent) {
  return function (props) {
    const toast = useToast();

    return <WrappedComponent toast={toast} {...props} />;
  };
}

class SwipeableRow extends Component {
  constructor(props) {
    super(props);
    this.swipeableRowRef = createRef();
  }

  leftSwipe = (progress, dragX) => {
    if (this.props.isEditingFavorite || this.props.isEditing) {
      return;
    }
    const trans = dragX.interpolate({
      inputRange: [0, 50, 90, 100],
      outputRange: [0, 5, 9, 10],
    });

    const text = (text) => "screens.Home.text." + text;
    const { toast, t } = this.props;

    const handleHide = () => {
      this.props.changeVis(this.props.tool.id);
      if (this.props.tool.isHidden) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show(t(text("toolHasBeenHidden")), {
          type: "success",
          placement: "top",
          duration: 1000,
          offset: 20,
          animationType: "zoom-in",
        });
        this.closeRow(this.props.index, true);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast.show(t(text("errorHiding")), {
          type: "warning",
          placement: "top",
          duration: 4000,
          offset: 20,
          animationType: "zoom-in",
        });
        this.closeRow(this.props.index, true);
      }
    };

    return (
      <RectButton
        className="h-32 mb-3"
        style={stylesLeft.leftAction}
        onPress={handleHide}
      >
        <View className="text-center flex-row flex-wrap ml-10 mt-9">
          <View style={{ width: "100%" }}>
            <TouchableOpacity activeOpacity={1} onPress={handleHide}>
              <SweetSFSymbol
                name={"eye.slash.fill"}
                size={30}
                colors={["white"]}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-white w-full mt-2 ">
            {this.props.t(text("hide"))}
          </Text>
        </View>
      </RectButton>
    );
  };

  rightSwipe = (progress, dragX) => {
    if (this.props.isEditingFavorite || this.props.isEditing) {
      return;
    }
    const trans = dragX.interpolate({
      inputRange: [0, 50, 90, 100],
      outputRange: [100, 105, 109, 110],
    });

    const text = (text) => "screens.Home.text." + text;
    const { toast, t } = this.props;

    const handleFavorite = () => {
      this.props.handleFavorite(this.props.tool.id);
      if (this.props.tool.isFavorite) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show(t(text("toolHasbeenFavored")), {
          type: "success",
          placement: "top",
          duration: 1000,
          offset: 20,
          animationType: "zoom-in",
        });
        this.closeRow(this.props.index, true);
      } else if (!this.props.tool.isFavorite) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show(t(text("toolHasbeenUnFavored")), {
          type: "success",
          placement: "top",
          duration: 1000,
          offset: 20,
          animationType: "zoom-in",
        });
        this.closeRow(this.props.index, true);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        toast.show(t(text("errorFavoriting")), {
          type: "warning",
          placement: "top",
          duration: 4000,
          offset: 20,
          animationType: "zoom-in",
        });
        this.closeRow(this.props.index, true);
      }
    };

    return (
      <RectButton
        className="h-32 mb-3"
        style={[
          stylesRight.leftAction,
          {
            backgroundColor: this.props.tool.isFavorite
              ? "crimson"
              : "darkorchid",
          },
        ]}
        onPress={handleFavorite}
      >
        <View className="text-center flex-row flex-wrap ml-5 mt-9">
          <View style={{ width: "100%" }}>
            <TouchableOpacity activeOpacity={1} onPress={handleFavorite}>
              <SweetSFSymbol
                name={this.props.tool.isFavorite ? "star.slash" : "star.fill"}
                size={30}
                colors={["white"]}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-white w-full -ml-5 mt-2 text-center">
            {this.props.tool.isFavorite
              ? t(text("unfavorite"))
              : t(text("favorite"))}
          </Text>
        </View>
      </RectButton>
    );
  };

  closeRow = (index, isThisRow) => {
    if (isThisRow) {
      row[index].close();
    } else {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    }
  };

  componentDidUpdate(prevProps) {
    // Check if the relevant props have changed
    if (
      prevProps.isShowedFavorite !== this.props.isShowedFavorite ||
      prevProps.isEditingFavorite !== this.props.isEditingFavorite ||
      prevProps.isEditing !== this.props.isEditing
    ) {
      // Call the function passed down to close all swipeable rows
      this.closeRow(this.props.index, true);
    }
  }

  renderLeftActions = lang === "ar" ? this.leftSwipe : this.rightSwipe;

  renderRightActions = lang === "ar" ? this.rightSwipe : this.leftSwipe;

  render() {
    return (
      <Swipeable
        ref={(ref) => (row[this.props.index] = ref)}
        overshootFriction={10}
        friction={3}
        renderRightActions={this.renderRightActions}
        renderLeftActions={this.renderLeftActions}
        onSwipeableWillOpen={() => this.closeRow(this.props.index, false)}
      >
        {this.props.children}
      </Swipeable>
    );
  }
}

const stylesLeft = StyleSheet.create({
  leftAction: {
    borderRadius: 10,
    backgroundColor: "gray",
    width: "23%",
    marginEnd: "4%",
    marginStart: "-10%",
  },
  actionText: {
    flexDirection: "column",
    color: "white",
    fontSize: 15,

    marginStart: "35%",
  },
});
const stylesRight = StyleSheet.create({
  leftAction: {
    borderRadius: 10,
    width: "23%",
    marginStart: "4%",
    marginEnd: "-10%",
  },
  actionText: {
    color: "white",
    fontSize: 15,
    marginEnd: "-185%",
  },
});

export default withHooks(SwipeableRow);
