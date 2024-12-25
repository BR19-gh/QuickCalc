function hijriToCalendars(year, month, day, op = {}) {
  op.fromCal ??= "islamic-umalqura"; //
  let gD = new Date(Date.UTC(2000, 0, 1));
  gD = new Date(
    gD.setUTCDate(
      gD.getUTCDate() +
        ~~(227022 + (year + (month - 1) / 12 + day / 354) * 354.367)
    )
  );
  const gY = gD.getUTCFullYear(gD) - 2000,
    dFormat = new Intl.DateTimeFormat("en-u-ca-" + op.fromCal, {
      dateStyle: "short",
      timeZone: "UTC",
    });
  gD = new Date(
    (gY < 0 ? "-" : "+") +
      ("00000" + Math.abs(gY)).slice(-6) +
      "-" +
      ("0" + (gD.getUTCMonth(gD) + 1)).slice(-2) +
      "-" +
      ("0" + gD.getUTCDate(gD)).slice(-2)
  );
  let [iM, iD, iY] = [...dFormat.format(gD).split("/")],
    i = 0;
  gD = new Date(
    gD.setUTCDate(
      gD.getUTCDate() +
        ~~(
          year * 354 +
          month * 29.53 +
          day -
          (iY.split(" ")[0] * 354 + iM * 29.53 + iD * 1) -
          2
        )
    )
  );
  while (i < 4) {
    [iM, iD, iY] = [...dFormat.format(gD).split("/")];
    if (iD == day && iM == month && iY.split(" ")[0] == year)
      return formatOutput(gD);
    gD = new Date(gD.setUTCDate(gD.getUTCDate() + 1));
    i++;
  }
  throw new Error("Invalid " + op.fromCal + " date!");
  function formatOutput(gD) {
    return "toCal" in op
      ? ((op.calendar = op.toCal),
        new Intl.DateTimeFormat((op.locale ??= "en"), op).format(gD))
      : gD;
  }
}

const a2e = (s) => {
  if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
};

const monthsNameArabic = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];
const monthsNamePersian = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const monthsNameHebrew = [
  "Tishri",
  "Heshvan",
  "Kislev",
  "Tevet",
  "Shevat",
  "Adar",
  "Nisan",
  "Iyar",
  "Sivan",
  "Tamuz",
  "Av",
  "Elul",
];

export function calculateTimeSince(dateString) {
  const providedDate = new Date(dateString);

  const currentDate = new Date();

  const differenceInMillis = currentDate - providedDate;

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const millisecondsInMonth = millisecondsInDay * 30.44;
  const millisecondsInYear = millisecondsInDay * 365.25;

  const yearsDifference = Math.floor(differenceInMillis / millisecondsInYear);
  const monthsDifference = Math.floor(
    (differenceInMillis % millisecondsInYear) / millisecondsInMonth
  );
  const daysDifference = Math.floor(
    ((differenceInMillis % millisecondsInYear) % millisecondsInMonth) /
      millisecondsInDay
  );

  return {
    years: yearsDifference,
    months: monthsDifference,
    days: daysDifference - 1,
  };
}

export const toHijri = (gy, gm, gd) => {
  const hijriYearInDays = 354.367; // Average number of days in an Islamic year
  const hijriMonthInDays = hijriYearInDays / 12;

  const providedDate = new Date(gy, gm - 1, gd);
  const currentDate = new Date();

  const differenceInMillis = currentDate - providedDate;
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  const daysDifference = Math.floor(differenceInMillis / millisecondsInDay);
  const yearsDifference = Math.floor(daysDifference / hijriYearInDays);
  const monthsDifference = Math.floor(
    (daysDifference % hijriYearInDays) / hijriMonthInDays
  );
  const remainingDaysDifference = Math.floor(
    (daysDifference % hijriYearInDays) % hijriMonthInDays
  );

  const timeSince = {
    years: yearsDifference,
    months: monthsDifference,
    days: remainingDaysDifference,
  };

  let hijriDateString = providedDate.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let hijriDateParts = hijriDateString.split(" ").map((part) => part.trim());

  if (hijriDateParts.length === 5) {
    hijriDateParts[1] = hijriDateParts[1] + " " + hijriDateParts[2];
    hijriDateParts.splice(2, 1);
  }

  hijriDateParts[1] = hijriDateParts[1].replace("،", "");

  let monthIndex = monthsNameArabic.indexOf(hijriDateParts[1].trim());

  return {
    hy: a2e(hijriDateParts[2]),
    hm: monthIndex + 1,
    hd: a2e(hijriDateParts[0]),
    timeSince,
  };
};
export const toPersian = (gy, gm, gd) => {
  let timeSince = calculateTimeSince(
    new Date(gy, gm, gd).toISOString().split("T")[0]
  );
  let dateSrting = new Date(gy, gm - 1, gd).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let dateParts = dateSrting.split(" ").map((part) => part.trim());

  return {
    day: dateParts[0],
    month: monthsNamePersian.indexOf(dateParts[1].trim()) + 1,
    year: dateParts[2],
    timeSince,
  };
};

export const toHebrew = (gy, gm, gd) => {
  let timeSince = calculateTimeSince(
    new Date(gy, gm, gd).toISOString().split("T")[0]
  );
  let dateSrting = new Date(gy, gm - 1, gd).toLocaleDateString(
    "en-u-ca-hebrew",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  console.log(dateSrting);
  let dateParts = dateSrting.split(" ").map((part) => part.trim());
  console.log(dateParts);
  if (dateParts[1].includes("I")) {
    dateParts[2] = dateParts[2].replace(",", "");
    return {
      day: dateParts[2],
      month: 6,
      year: dateParts[3],
      timeSince,
    };
  } else {
    dateParts[1] = dateParts[1].replace(",", "");
    return {
      day: dateParts[1],
      month: monthsNameHebrew.indexOf(dateParts[0].trim()) + 1,
      year: dateParts[2],
      timeSince,
    };
  }
};

export const toGregorian = (hy, hm, hd) => {
  let result = hijriToCalendars(hy, hm, hd);

  const date = new Date(result);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Month is zero-indexed, so add 1
  const day = date.getUTCDate();
  let timeSince = calculateTimeSince(
    new Date(year, month - 1, day).toISOString().split("T")[0]
  );
  return {
    gy: year,
    gm: month,
    gd: day,
    timeSince,
  };
};
