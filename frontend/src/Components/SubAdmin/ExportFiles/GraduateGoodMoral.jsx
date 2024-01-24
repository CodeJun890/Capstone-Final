import CvsuPhone from "../../../Assets/phone.png";
import ReactPDF, {
  Page,
  Text,
  Image,
  Link,
  Document,
  StyleSheet,
  Font,
  View,
} from "@react-pdf/renderer";

import CvsuLogo from "../../../Assets/cvsu-docs.png";

import CenturyGothic from "../../../fonts/CenturyGothic.ttf";
import CenturyGothicBold from "../../../fonts/CenturyGothicBold.ttf";
import BookManBold from "../../../fonts/Bookman Old Style Bold.ttf";
import BookManRegular from "../../../fonts/Bookman Old Style Regular.ttf";
import QuintessentialRegular from "../../../fonts/Quintessential-Regular.ttf";
import ArialBold from "../../../fonts/ArialBold.ttf";
import ArialItalic from "../../../fonts/ArialItalic.ttf";
import Arial from "../../../fonts/Arial.ttf";
import TimesNewRomanItalic from "../../../fonts/TimesNewRomanItalic.ttf";
import { format } from "date-fns";

Font.register({ family: "Bookman-Bold", src: BookManBold });
Font.register({ family: "Bookman-Regular", src: BookManRegular });
Font.register({ family: "Century-Gothic", src: CenturyGothic });
Font.register({ family: "Century-Gothic-Bold", src: CenturyGothicBold });
Font.register({ family: "Quintessential-Regular", src: QuintessentialRegular });
Font.register({ family: "Arial-Bold", src: ArialBold });
Font.register({ family: "Arial-Italic", src: ArialItalic });
Font.register({ family: "Arial", src: Arial });
Font.register({ family: "Times-New-Roman-Italic", src: TimesNewRomanItalic });

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
    position: "relative",
  },
  headerWrap: {
    flexDirection: "column",
    alignItems: "center",
  },
  headerImg: {
    width: "70px",
    position: "absolute",
    top: 50,
    right: -160,
  },
  headerTxt1: {
    color: "#000000",
    marginTop: "50px",
    fontFamily: "Century-Gothic",
    fontSize: "12px",
  },
  headerTxt2: {
    color: "#000000",
    fontFamily: "Bookman-Bold",
    fontSize: "14px",
    textTransform: "uppercase",
  },
  headerTxt3: {
    color: "#000000",
    fontFamily: "Century-Gothic-Bold",
    fontSize: "11px",
  },
  headerTxt4: {
    color: "#000000",
    fontFamily: "Quintessential-Regular",
    fontSize: "10px",
  },
  headerTxt5: {
    color: "#000000",
    fontFamily: "Bookman-Bold",
    fontSize: "14px",
    marginTop: "30px",
    marginBottom: "20px",
  },
  phoneNumber: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  phoneImg: {
    width: "18px",
  },
  webLink: {
    fontFamily: "Century-Gothic",
    fontSize: "10px",
  },
  date: {
    marginLeft: 160,
    marginTop: 10,
  },
});

export default function GraduateGoodMoral({
  firstName,
  middleName,
  lastName,
  date,
  gender,
}) {
  const currentDate = format(new Date(), "d MMMM yyyy");
  return (
    <>
      <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>
          <div>
            <Image style={styles.headerImg} src={CvsuLogo} />
          </div>
          <div style={styles.headerWrap}>
            <Text style={styles.headerTxt1}>Republic of the Philippines</Text>
            <Text style={styles.headerTxt2}>Cavite State University</Text>
            <Text style={styles.headerTxt3}>Trece Martires City</Text>

            <View style={styles.phoneNumber}>
              <Image style={styles.phoneImg} source={CvsuPhone} />{" "}
              <Text style={styles.headerTxt4}>046 866 4981</Text>
            </View>
            <Link style={styles.webLink}>www.cvsu.edu.ph</Link>
            <Text style={styles.headerTxt5}>
              OFFICE OF STUDENT AFFAIRS AND SERVICES
            </Text>

            <View style={{ width: "100%" }}>
              <View style={styles.date}>
                <Text
                  style={{
                    fontFamily: "Arial",
                    marginLeft: 200,
                    fontSize: "12px",
                  }}
                  fixed
                >
                  {currentDate}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Arial-Bold",
                    fontSize: "16px",
                    alignSelf: "center",
                    marginTop: 35,
                  }}
                  fixed
                >
                  CERTIFICATION
                </Text>
              </View>
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    fontFamily: "Arial",
                    fontSize: "12px",
                    marginTop: 35,
                    textIndent: 30,
                    textAlign: "justify",
                    paddingHorizontal: 85,
                    lineHeight: 1.5,
                  }}
                  fixed
                >
                  This is to certify that{" "}
                  <Text
                    style={{
                      textTransform: "uppercase",
                      fontFamily: "Arial-Bold",
                    }}
                  >{`${firstName} ${middleName.charAt(
                    0
                  )}. ${lastName}`}</Text>{" "}
                  graduated in this University on <Text>{date}</Text>.
                </Text>

                <Text
                  style={{
                    fontFamily: "Arial",
                    fontSize: "12px",
                    marginTop: 28,
                    textAlign: "justify",
                    paddingHorizontal: 85,
                    lineHeight: 1.5,
                    textIndent: 30,
                  }}
                  fixed
                >
                  This further certifies that the above-mentioned student has a
                  good moral character and has not been subjected to any
                  disciplinary action for violation of the rules and regulation
                  of the University and the provisions in the Student Norms of
                  Conduct.
                </Text>
                <Text
                  style={{
                    fontFamily: "Arial",
                    fontSize: "12px",
                    marginTop: 28,
                    textIndent: 30,
                    textAlign: "justify",
                    paddingHorizontal: 85,
                    lineHeight: 1.5,
                  }}
                  fixed
                >
                  This certification is issued upon the request of{" "}
                  <Text style={{ fontFamily: "Arial-Bold" }}>
                    {gender == "Male" ? `Mr. ${lastName}` : `Ms. ${lastName}`}{" "}
                  </Text>
                  for further studies purposes only.
                </Text>
                <View style={{ alignSelf: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Arial-Bold",
                      marginLeft: 230,
                      marginTop: 100,
                      fontSize: "12px",
                      alignSelf: "center",
                    }}
                    fixed
                  >
                    LILIAN O. SIDAMON
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arial-Italic",
                      marginLeft: 230,
                      fontSize: "12px",
                      alignSelf: "center",
                    }}
                    fixed
                  >
                    Head, OSAS
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Times-New-Roman-Italic",
                    marginRight: 270,
                    marginTop: 50,
                    fontSize: "11px",
                    alignSelf: "center",
                  }}
                  fixed
                >
                  Not valid without the University seal
                </Text>
              </View>
            </View>
          </div>
        </Page>
      </Document>
    </>
  );
}
