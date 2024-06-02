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
  maxLength = date === "day" ? 2 : date === "month" ? 2 : 4,
}) => (
  <TextInput
    maxLength={maxLength}
    editable={isEditable}
    style={{
      margin: 1,
      backgroundColor: isEditable
        ? isDark("#2C2C2D", "#FFFFFF")
        : isDark("#2C2C2D99", "#CCCCCC"),
      width: 150,
      height: 50,
      fontSize: calendarValue[date] ? 40 : 20,
      textAlign: "center",
      color: isEditable
        ? isDark("#DBEAFE", "#283987")
        : isDark("#C1D4F1", "#495A7C"),
      borderRadius: 10,
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
    placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
    placeholder={t(text(date))}
    keyboardType="number-pad"
  />
);

export default DateInput;
