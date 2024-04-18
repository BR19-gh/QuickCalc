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

export const toHijri = (gy, gm, gd) => {
  let hijriDateString = new Date(gy, gm - 1, gd).toLocaleDateString("ar-SA", {
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
  };
};
export const toPersian = (gy, gm, gd) => {
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
  };
};

export const toHebrew = (gy, gm, gd) => {
  let dateSrting = new Date(gy, gm - 1, gd).toLocaleDateString(
    "en-u-ca-hebrew",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  let dateParts = dateSrting.split(" ").map((part) => part.trim());
  dateParts[1] = dateParts[1].replace(",", "");
  return {
    day: dateParts[1],
    month: monthsNameHebrew.indexOf(dateParts[0].trim()) + 1,
    year: dateParts[2],
  };
};

export const toGregorian = (hy, hm, hd) => {
  let result = hijriToCalendars(hy, hm, hd);

  const date = new Date(result);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Month is zero-indexed, so add 1
  const day = date.getUTCDate();

  return {
    gy: year,
    gm: month,
    gd: day,
  };
};
