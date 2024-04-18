import { TextInput, Keyboard } from "react-native";

const hideKeyboard = () => {
  Keyboard.dismiss();
};

const a2e = (s) => {
  if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
};

const DateInput = ({
  calendarValue,
  date,
  setCalendarValue,
  isEditable,
  isDark,
  t,
  text,
}) => (
  <TextInput
    editable={isEditable}
    style={{
      backgroundColor: isEditable
        ? isDark("#CCCCCC", "#FFFFFF")
        : isDark("#888888", "#CCCCCC"),
      width: 150,
      height: 50,
      fontSize: calendarValue[date] ? 40 : 20,
      textAlign: "center",
      color: isDark("#283dab", "#283987"),
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#283dab88",
    }}
    blurOnSubmit={false}
    returnKeyType={"done"}
    onSubmitEditing={() => {
      hideKeyboard();
    }}
    value={calendarValue[date]}
    onChangeText={(value) => {
      if (date === "day") {
        setCalendarValue({
          ...calendarValue,
          day: a2e(value),
        });
      } else if (date === "month") {
        setCalendarValue({
          ...calendarValue,
          month: a2e(value),
        });
      } else if (date === "year") {
        setCalendarValue({
          ...calendarValue,
          year: a2e(value),
        });
      }
    }}
    onFocus={() => {
      if (date === "day") {
        setCalendarValue({
          ...calendarValue,
          day: "",
        });
      } else if (date === "month") {
        setCalendarValue({
          ...calendarValue,
          month: "",
        });
      } else if (date === "year") {
        setCalendarValue({
          ...calendarValue,
          year: "",
        });
      }
    }}
    placeholderTextColor={isDark("#28398788", "#28398755")}
    placeholder={t(text(date))}
    keyboardType="number-pad"
  />
);

export default DateInput;
