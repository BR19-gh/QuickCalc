import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
  Alert,
  Clipboard,
  Dimensions,
  Switch,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";
import SelectDropdown from "react-native-select-dropdown";

import { useState, useRef, useEffect } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";

import * as Haptics from "expo-haptics";

import * as StoreReview from "expo-store-review";

import InlineAd from "../../../components/InlineAd/InlineAd";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

import uuid from "react-native-uuid";

import { useNavigation } from "@react-navigation/native";

import { getCoursesAsync, setCoursesAsync } from "../../../../_DATA";

function GPACal(props) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.GPACal.text." + text;
  const secondInput = useRef(null);
  const [courses, setCourses] = useState([
    {
      id: uuid.v4(),
      name: "",
      credit: "",
      grade: "",
    },
  ]);
  const [scale, setScale] = useState("");
  const [gpa, setGpa] = useState("");
  const [isPrevGPA, setIsPrevGPA] = useState(false);
  const [prevGPA, setPrevGPA] = useState({
    credit: "",
    gpa: "",
  });

  const focusOnSecondInput = () => {
    if (secondInput && secondInput.current) {
      secondInput.current.focus();
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const navigation = useNavigation();

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      navigation.goBack();
    }
  }, [props.theme]);

  const toast = useToast();

  const copyToClipboard = (str) => {
    Haptics.selectionAsync();
    toast.show(t(text("copied")), {
      placement: "top",
      type: "normal",
      duration: 800,
    });
    Clipboard.setString(str);
    setTimeout(() => {
      StoreReview.requestReview();
    }, 800);
  };

  function calculate() {
    if (
      (isPrevGPA === false
        ? true
        : isPrevGPA &&
          prevGPA.credit !== "" &&
          prevGPA.gpa !== "" &&
          !isNaN(a2e(prevGPA.credit)) &&
          !isNaN(a2e(prevGPA.gpa))) &&
      courses.every((course) => {
        return (
          scale &&
          course.grade !== "" &&
          course.credit !== "" &&
          !isNaN(a2e(course.credit))
        );
      })
    ) {
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t(text("errorInValidInput")),
        t(text("onlyNumbers")),
        [
          {
            text: t(text("gotIt")),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    }

    const gradePoints = {
      "A+": { 4: 4.0, 5: 5.0 },
      A: { 4: 3.75, 5: 4.75 },
      "B+": { 4: 3.5, 5: 4.5 },
      B: { 4: 3.0, 5: 4.0 },
      "C+": { 4: 2.5, 5: 3.5 },
      C: { 4: 2.0, 5: 3.0 },
      "D+": { 4: 1.5, 5: 2.5 },
      D: { 4: 1.0, 5: 2.0 },
      F: { 4: 0.0, 5: 1.0 },
    };

    // Initialize total grade points and total credit hours
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    // If there is a previous GPA, include it in the calculation
    if (isPrevGPA) {
      const prevCreditHours = Number(prevGPA.credit);
      const prevGpa = Number(prevGPA.gpa);

      if (!isNaN(prevCreditHours) && !isNaN(prevGpa) && prevCreditHours > 0) {
        totalGradePoints += prevGpa * prevCreditHours;
        totalCreditHours += prevCreditHours;
      }
    }

    // Iterate over the courses array
    for (const course of courses) {
      const grade = course.grade;
      const credit = Number(course.credit);

      if (gradePoints.hasOwnProperty(grade) && credit > 0) {
        totalGradePoints += gradePoints[grade][scale] * credit;
        totalCreditHours += credit;
      }
    }

    // Calculate GPA
    const gpa = totalGradePoints / totalCreditHours;
    setGpa(gpa.toFixed(2));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scrollViewSizeChanged(1000);
  }

  const scaleRef = useRef(null);
  const prevGPARef = useRef(null);
  const coursesRef = useRef([]);

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCourses([
      {
        id: uuid.v4(),
        name: "",
        credit: "",
        grade: "",
      },
    ]);
    setScale("");
    setGpa("");
    setIsPrevGPA(false);
    setPrevGPA({
      credit: "",
      gpa: "",
    });
    scaleRef.current.reset();
    prevGPARef.current.reset();

    if (coursesRef.current) {
      for (let i = 0; i < coursesRef.current.length; i++) {
        coursesRef.current[i] ? coursesRef.current[i].reset() : null;
      }
    }
  };

  const isDark = (darkOp, lightp) => (props.theme === "dark" ? darkOp : lightp);

  const scrollViewRef = useRef(null);

  function scrollViewSizeChanged(height) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  const { user } = useRevenueCat();

  useEffect(() => {
    console.log("courses", courses);
    console.log("scale", scale);
    console.log("isPrevGPA", isPrevGPA);
    console.log("prevGPA", prevGPA);
    console.log("gpa", gpa);
  }, [courses, scale, isPrevGPA, prevGPA, gpa]);

  const [saveCoursesSwitchValue, setSaveCoursesSwitchValue] = useState(false);
  const toggleSaveCoursesSwitch = () => {
    setSaveCoursesSwitchValue((prev) => !prev);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedData = await getCoursesAsync();

      const courses = JSON.parse(fetchedData.split("|")[0]);
      const scale = JSON.parse(fetchedData.split("|")[1]);
      const isPrevGPA = JSON.parse(fetchedData.split("|")[2]);
      const prevGPA = JSON.parse(fetchedData.split("|")[3]);

      if (fetchedData === null) {
        return;
      }

      if (courses.length > 0) {
        setCourses(courses);
        setScale(scale);
        setIsPrevGPA(isPrevGPA);
        setPrevGPA(prevGPA);
        setSaveCoursesSwitchValue(true);
      } else {
        setSaveCoursesSwitchValue(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const saveCourses = async (value) => {
      if (value === true) {
        await setCoursesAsync(
          `${JSON.stringify(courses)}|${JSON.stringify(scale)}|${JSON.stringify(
            isPrevGPA
          )}|${JSON.stringify(prevGPA)}`
        );
      } else {
        await setCoursesAsync(null);
      }
    };
    if (saveCoursesSwitchValue === true) {
      saveCourses(true);
    } else {
      saveCourses(false);
    }
  }, [saveCoursesSwitchValue, courses, scale, isPrevGPA, prevGPA, gpa]);

  return (
    <View>
      <ScrollView
        style={{
          height: user.golden
            ? "100%"
            : Dimensions.get("window").height > 667
            ? "93%"
            : "91%",
        }}
        ref={scrollViewRef}
      >
        <View
          className={
            "w-full " +
            (Dimensions.get("window").height > 667 ? "mt-24" : "mt-16") +
            " items-center"
          }
        >
          <View className="w-full flex-row items-center justify-evenly">
            <View
              className={"w-52 flex-row items-center justify-center flex-wrap"}
            >
              <Text
                className={
                  "text-center p-4 text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("saveCourses"))}
              </Text>
              <Switch
                onValueChange={() => {
                  if (saveCoursesSwitchValue) {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  } else {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                  }

                  toggleSaveCoursesSwitch();
                }}
                value={saveCoursesSwitchValue}
              />
            </View>
          </View>
          <View className="w-full flex-row justify-center">
            <View
              className={"w-52 flex-row items-center justify-center flex-wrap"}
            >
              <Text
                className={
                  "text-center p-4 text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("selectScale"))}
              </Text>
              <SelectDropdown
                ref={scaleRef}
                data={["5", "4"]}
                onSelect={(selectedItem) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  setScale(selectedItem);
                }}
                renderButton={(selectedItem, isOpened, isSelected) => {
                  return (
                    <View
                      style={{
                        marginBottom: 2,
                        backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                        width: 150,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        {selectedItem ? (
                          <Text
                            style={{
                              color: isDark("#DBEAFE", "#283987"),
                              fontSize: selectedItem ? 30 : 18,
                              textAlign: "center",
                            }}
                          >
                            {selectedItem}
                          </Text>
                        ) : scale ? (
                          <Text
                            style={{
                              color: isDark("#DBEAFE", "#283987"),
                              fontSize: 30,
                              textAlign: "center",
                            }}
                          >
                            {scale}
                          </Text>
                        ) : (
                          <View className="flex-row items-center justify-center">
                            <Text
                              style={{
                                color: isDark("#DBEAFE88", "#28398755"),
                                fontSize: 18,
                                textAlign: "center",
                              }}
                            >
                              {t(text("selectScale")) + "   "}
                            </Text>
                            <SweetSFSymbol
                              name={isOpened ? "chevron.up" : "chevron.down"}
                              colors={[isDark("#DBEAFE88", "#28398755")]}
                              size={17}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...{
                          width: "100%",
                          flexDirection: "row",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                        },
                      }}
                    >
                      <Text
                        className="text-center"
                        style={{
                          color: isDark("#DBEAFE", "#1E3A8A"),
                          flex: 1,
                          fontSize: 18,
                          fontWeight: "300",
                          ...(isSelected && {
                            fontWeight: "bold",
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
                  backgroundColor:
                    props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                  borderRadius: 8,
                }}
              />
            </View>
            <View
              className={"w-52 flex-row items-center justify-center flex-wrap"}
            >
              <Text
                className={
                  "text-center p-4 text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("isPrevGPA"))}
              </Text>
              <SelectDropdown
                ref={prevGPARef}
                data={[t(text("cumulative")), t(text("semester"))]}
                onSelect={(selectedItem) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  setIsPrevGPA(selectedItem === t(text("cumulative")));
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View
                      style={{
                        marginBottom: 2,
                        backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                        width: 150,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        {selectedItem ? (
                          <Text
                            style={{
                              color: isDark("#DBEAFE", "#283987"),
                              fontSize: selectedItem ? 25 : 18,
                              textAlign: "center",
                            }}
                          >
                            {selectedItem}
                          </Text>
                        ) : isPrevGPA ? (
                          <Text
                            style={{
                              color: isDark("#DBEAFE", "#283987"),
                              fontSize: 25,
                              textAlign: "center",
                            }}
                          >
                            {isPrevGPA === true
                              ? t(text("cumulative"))
                              : t(text("semester"))}
                          </Text>
                        ) : (
                          <View className="flex-row items-center justify-center">
                            <Text
                              style={{
                                color: isDark("#DBEAFE88", "#28398755"),
                                fontSize: 18,
                                textAlign: "center",
                              }}
                            >
                              {t(text("isPrevGPA")) + "   "}
                            </Text>
                            <SweetSFSymbol
                              name={isOpened ? "chevron.up" : "chevron.down"}
                              colors={[isDark("#DBEAFE88", "#28398755")]}
                              size={17}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...{
                          width: "100%",
                          flexDirection: "row",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                        },
                      }}
                    >
                      <Text
                        className="text-center"
                        style={{
                          flex: 1,
                          fontSize: 18,
                          fontWeight: "300",
                          color: isDark("#DBEAFE", "#1E3A8A"),
                          ...(isSelected && {
                            fontWeight: "bold",
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
                  backgroundColor:
                    props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
          {isPrevGPA ? (
            <View className={"w-full flex-row flex-wrap  justify-center"}>
              <View
                className={
                  "w-52 flex-row items-center justify-center flex-wrap"
                }
              >
                <Text
                  className={
                    "text-center p-4 text-2xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("prevGPA"))}
                </Text>
                <TextInput
                  style={{
                    marginBottom: 2,
                    backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                    width: 150,
                    height: 50,
                    fontSize: prevGPA.gpa ? 30 : 18,
                    textAlign: "center",
                    color: isDark("#DBEAFE", "#283987"),
                    borderRadius: 10,
                  }}
                  returnKeyType={"done"}
                  value={prevGPA.gpa}
                  onChangeText={(value) => {
                    setPrevGPA((prev) => ({
                      ...prev,
                      gpa: value,
                    }));
                  }}
                  onFocus={() =>
                    setPrevGPA((prev) => ({
                      ...prev,
                      gpa: "",
                    }))
                  }
                  maxLength={4}
                  placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                  placeholder={t(text("gpa"))}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={{
                    marginBottom: 2,
                    backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                    width: 150,
                    height: 50,
                    fontSize: prevGPA.credit ? 30 : 18,
                    textAlign: "center",
                    color: isDark("#DBEAFE", "#283987"),
                    borderRadius: 10,
                  }}
                  returnKeyType={"done"}
                  value={prevGPA.credit}
                  onChangeText={(value) => {
                    setPrevGPA((prev) => ({
                      ...prev,
                      credit: value,
                    }));
                  }}
                  onFocus={() =>
                    setPrevGPA((prev) => ({
                      ...prev,
                      credit: "",
                    }))
                  }
                  maxLength={3}
                  placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                  placeholder={t(text("creditHours"))}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ) : null}
          <View className={"w-full flex-row flex-wrap"}>
            {courses.map((course, index) => (
              <View key={index} className="w-1/2  items-center">
                <View
                  className={
                    "w-full flex-row flex-wrap items-center justify-center"
                  }
                >
                  <Text
                    className={
                      "text-center p-4 text-2xl font-semibold  -ml-4" +
                      isDark(" text-blue-100", " text-blue-900")
                    }
                  >
                    {t(text("course")) + " " + Number(index + 1)}{" "}
                  </Text>
                  {courses.length > 1 && (
                    <TouchableOpacity
                      className="-ml-2"
                      onPress={() => {
                        setCourses((prev) => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          const newCourses = [...prev];
                          newCourses.splice(index, 1);
                          return newCourses;
                        });
                      }}
                    >
                      <SweetSFSymbol
                        name="trash.circle.fill"
                        colors={[isDark("#DBEAFE", "#283987")]}
                        size={24}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={{
                    marginBottom: 2,
                    backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                    width: 150,
                    height: 50,
                    fontSize: course.name ? 30 : 18,
                    textAlign: "center",
                    color: isDark("#DBEAFE", "#283987"),
                    borderRadius: 10,
                  }}
                  returnKeyType={"done"}
                  value={courses[index].name}
                  onChangeText={(value) => {
                    setCourses((prev) =>
                      prev.map((course) => {
                        if (course.id === courses[index].id) {
                          course.name = value;
                        }
                        return course;
                      })
                    );
                  }}
                  onFocus={() =>
                    setCourses((prev) =>
                      prev.map((course) => {
                        if (course.id === courses[index].id) {
                          course.name = "";
                        }
                        return course;
                      })
                    )
                  }
                  maxLength={10}
                  placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                  placeholder={t(text("courseName"))}
                  keyboardType="default"
                />
                <SelectDropdown
                  ref={(ref) => (coursesRef.current[index] = ref)}
                  data={["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]}
                  onSelect={(selectedItem) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    setCourses((prev) =>
                      prev.map((course) => {
                        if (course.id === courses[index].id) {
                          course.grade = selectedItem;
                        }
                        return course;
                      })
                    );
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View
                        style={{
                          marginBottom: 2,
                          backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                          width: 150,
                          height: 50,
                          textAlign: "center",
                          borderRadius: 10,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          {course.grade ? (
                            <Text
                              style={{
                                color: isDark("#DBEAFE", "#283987"),
                                fontSize: 35,
                                textAlign: "center",
                              }}
                            >
                              {course.grade}
                            </Text>
                          ) : selectedItem ? (
                            <Text
                              style={{
                                color: isDark("#DBEAFE", "#283987"),
                                fontSize: 35,
                                textAlign: "center",
                              }}
                            >
                              {selectedItem}
                            </Text>
                          ) : (
                            <View className="flex-row items-center justify-center">
                              <Text
                                style={{
                                  color: isDark("#DBEAFE88", "#28398755"),
                                  fontSize: 18,
                                  textAlign: "center",
                                }}
                              >
                                {t(text("selectGrade")) + "   "}
                              </Text>
                              <SweetSFSymbol
                                name={isOpened ? "chevron.up" : "chevron.down"}
                                colors={[isDark("#DBEAFE88", "#28398755")]}
                                size={17}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View
                        style={{
                          ...{
                            width: "100%",
                            flexDirection: "row",
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                          },
                        }}
                      >
                        <Text
                          className="text-center"
                          style={{
                            flex: 1,
                            fontSize: 18,
                            fontWeight: "300",
                            color: isDark("#DBEAFE", "#1E3A8A"),
                            ...(isSelected && {
                              fontWeight: "bold",
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
                    backgroundColor:
                      props.theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                    borderRadius: 8,
                  }}
                />

                <TextInput
                  style={{
                    marginBottom: 2,
                    backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                    width: 150,
                    height: 50,
                    fontSize: course.credit ? 30 : 18,
                    textAlign: "center",
                    color: isDark("#DBEAFE", "#283987"),
                    borderRadius: 10,
                  }}
                  returnKeyType={"done"}
                  value={courses[index].credit}
                  onChangeText={(value) => {
                    setCourses((prev) =>
                      prev.map((course) => {
                        if (course.id === courses[index].id) {
                          course.credit = value;
                        }
                        return course;
                      })
                    );
                  }}
                  onFocus={() =>
                    setCourses((prev) =>
                      prev.map((course) => {
                        if (course.id === courses[index].id) {
                          course.credit = "";
                        }
                        return course;
                      })
                    )
                  }
                  maxLength={2}
                  placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                  placeholder={t(text("creditHours"))}
                  keyboardType="decimal-pad"
                />
              </View>
            ))}
            <View
              style={{
                height: 220,
              }}
              className="w-1/2 items-center justify-center"
            >
              <TouchableOpacity
                className={
                  "h-9 w-9 mt-14 flex-row items-center justify-center mb-0.5 bg-white"
                }
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCourses(
                    courses.concat({
                      id: uuid.v4(),
                      name: "",
                      credit: "",
                      grade: "",
                    })
                  );
                }}
              >
                <SweetSFSymbol
                  name={"plus.circle.fill"}
                  size={70}
                  colors={[isDark("#5450D4", "#38377C")]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "rounded-lg w-48 h-20 mt-14 flex-row items-center justify-evenly"
              }
              style={{ backgroundColor: "#38377C" }}
              onPress={calculate}
            >
              <Text className={styles.btnText}>{t(text("calculate"))}</Text>
              <SweetSFSymbol
                name={"plusminus.circle.fill"}
                size={30}
                colors={["white"]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly"
              }
              style={{ backgroundColor: "#5450D4" }}
              onPress={reset}
            >
              <Text className={"text-xl text-white text-center"}>
                {t(text("reset"))}
              </Text>
              <SweetSFSymbol
                name={"arrow.counterclockwise.circle.fill"}
                size={20}
                colors={["white"]}
              />
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row flex-wrap mt-14">
            <View className="w-full flex-row p-2 text-left">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("gpa")) + ": "}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {gpa !== "0" ? gpa : ""}
                </Text>
                <Text>{"   "}</Text>
              </>
              {gpa !== "" ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() => copyToClipboard(gpa !== "0" ? `${gpa}` : "")}
                >
                  <SweetSFSymbol
                    name="doc.on.doc"
                    size={20}
                    colors={[isDark("#DBEAFE", "#1E3A8A")]}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
      {user.golden ? null : <InlineAd />}
    </View>
  );
}

const mapStateToProps = ({}) => {
  return {};
};

export default connect(mapStateToProps)(GPACal);
