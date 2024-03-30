import { Animated } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { Component, createRef } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

import { useToast } from "react-native-toast-notifications";

import { NativeModules } from "react-native";

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

    return (
      <RectButton
        className="h-36 mb-1 mt-1"
        style={stylesLeft.leftAction}
        onPress={() => {
          this.props.changeVis(this.props.tool.id);
          if (this.props.tool.isHidden) {
            toast.show(t(text("toolHasBeenHidden")), {
              type: "success",
              placement: "top",
              duration: 1000,
              offset: 20,
              animationType: "zoom-in",
            });
            this.closeRow(this.props.index, true);
          } else {
            toast.show(t(text("errorHiding")), {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 20,
              animationType: "zoom-in",
            });
            this.closeRow(this.props.index, true);
          }
        }}
      >
        <Animated.Text
          className="text-center pt-10"
          style={[
            stylesLeft.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <MaterialCommunityIcons name={"eye-off"} size={35} color="white" />
          {"\n"}
          <Text className="w-full"> {this.props.t(text("hide"))}</Text>
        </Animated.Text>
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

    return (
      <RectButton
        className="h-36 mb-1 mt-1"
        style={[
          stylesRight.leftAction,
          {
            backgroundColor: this.props.tool.isFavorite
              ? "crimson"
              : "darkorchid",
          },
        ]}
        onPress={() => {
          this.props.handleFavorite(this.props.tool.id);
          if (this.props.tool.isFavorite) {
            toast.show(t(text("toolHasbeenFavored")), {
              type: "success",
              placement: "top",
              duration: 1000,
              offset: 20,
              animationType: "zoom-in",
            });
            this.closeRow(this.props.index, true);
          } else if (!this.props.tool.isFavorite) {
            toast.show(t(text("toolHasbeenUnFavored")), {
              type: "success",
              placement: "top",
              duration: 1000,
              offset: 20,
              animationType: "zoom-in",
            });
            this.closeRow(this.props.index, true);
          } else {
            toast.show(t(text("errorFavoriting")), {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 20,
              animationType: "zoom-in",
            });
            this.closeRow(this.props.index, true);
          }
        }}
      >
        <Animated.Text
          className={
            "text-center text-base text-white" +
            (lang === "ar" ? " pl-5" : " pr-5") +
            (this.props.tool.isFavorite ? " pt-10" : " pt-12")
          }
          style={[]}
        >
          <MaterialCommunityIcons
            name={this.props.tool.isFavorite ? "star-minus" : "star-plus"}
            size={35}
            color="white"
          />
          {"\n"}
          {this.props.tool.isFavorite
            ? this.props.t(text("unfavorite"))
            : this.props.t(text("favorite"))}
        </Animated.Text>
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
