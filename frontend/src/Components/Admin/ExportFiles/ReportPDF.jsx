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
import { format } from "date-fns";

Font.register({ family: "Bookman-Bold", src: BookManBold });
Font.register({ family: "Bookman-Regular", src: BookManRegular });
Font.register({ family: "Century-Gothic", src: CenturyGothic });
Font.register({ family: "Century-Gothic-Bold", src: CenturyGothicBold });
Font.register({ family: "Quintessential-Regular", src: QuintessentialRegular });
Font.register({ family: "Arial-Bold", src: ArialBold });
Font.register({ family: "Arial-Italic", src: ArialItalic });
Font.register({ family: "Arial", src: Arial });

// Create styles
const styles = StyleSheet.create({
  fullName: {
    textTransform: "capitalize",
  },
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
  webLink: {
    fontFamily: "Century-Gothic",
    fontSize: "10px",
  },
  headerImg: {
    width: "70px",
    position: "absolute",
    top: 50,
    right: -240,
  },

  tableWrap: {
    padding: "0 50px",
  },
  table3: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  table1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    width: "auto",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    fontWeight: "bold",
  },
  tableRow1: {
    margin: "auto",
    flexDirection: "row",
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  tableCol: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    width: "120px",
    padding: "5px 10px",
  },
  tableHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: "10px 10px",
  },

  tableName: {
    fontSize: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "10px",
  },
  section: {
    fontSize: "10px",
    marginTop: "10px",
    marginRight: "10px",
  },
  dateToday: {
    fontSize: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    marginRight: "10px",
  },
  tableStudentNumber: {
    fontSize: "10px",
    marginTop: "10px",
    marginLeft: "10px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    top: 30,
    right: 60,
    color: "black",
  },

  phoneImg: {
    width: "18px",
  },

  phoneNumber: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  wrapBottom: {
    display: "flex",
    flex: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -110,
    right: 55,
  },

  headName: {
    fontSize: 12,
    fontWeight: "black",
    textTransform: "uppercase",
    fontFamily: "Arial-Bold",
  },

  profileImage: {
    width: "70px",
    position: "absolute",
    left: 50,
    top: 120,
    paddingBottom: 5,
  },
});

// Create Document Component
export default function ReportPDF({ studentInfo }) {
  const uniqueFullNamesSet = new Set();

  const uniqueFullNames = studentInfo
    .map((student) => {
      const fullName =
        student.firstName +
          " " +
          (student.middleName.charAt(0) + ". " || "") +
          student.lastName +
          " " +
          student.suffix || "";

      if (!uniqueFullNamesSet.has(fullName)) {
        uniqueFullNamesSet.add(fullName);
        return fullName;
      }

      return null;
    })
    .filter((fullName) => fullName !== null);
  const uniqueProfileImageSet = new Set();
  const uniqueProfileImage = studentInfo
    .map((student) => {
      const profile = student.profileImage;
      if (!uniqueProfileImageSet.has(profile)) {
        uniqueProfileImageSet.add(profile);
        return profile;
      }
      return null;
    })
    .filter((profile) => profile !== null);
  const uniqueStudentNumbersSet = new Set();

  const uniqueStudentNumbers = studentInfo
    .map((student) => student.studentNumber)
    .filter((studentNumber) => {
      if (!uniqueStudentNumbersSet.has(studentNumber)) {
        uniqueStudentNumbersSet.add(studentNumber);
        return true;
      }
      return false;
    });
  const uniqueSection = studentInfo
    .map((student) => student.sectionYear)
    .filter((sectionYear) => {
      if (!uniqueStudentNumbersSet.has(sectionYear)) {
        uniqueStudentNumbersSet.add(sectionYear);
        return true;
      }
      return false;
    });

  const currentDate = format(new Date(), "MMMM d, yyyy");
  return (
    <>
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page} wrap>
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
            <Image
              style={styles.profileImage}
              source={`${uniqueProfileImage}`}
            />
            <div style={styles.tableWrap}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>
                    STUDENT VIOLATION | OFFENSE
                  </Text>
                </View>
              </View>
              <View style={styles.table1}>
                <View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableStudentNumber}>
                      Student Number: <Text>{uniqueStudentNumbers}</Text>
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableName}>
                      Name:{" "}
                      <Text style={styles.fullName}>{uniqueFullNames}</Text>
                    </Text>
                  </View>
                </View>
                <View>
                  <View style={styles.tableRow}>
                    <Text style={styles.section}>
                      Section:{" "}
                      <Text style={styles.section}>{uniqueSection}</Text>
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.dateToday}>
                      Date: <Text style={styles.date}>{currentDate}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.table3}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>TYPE OF OFFENSE</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>VIOLATION</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>SANCTION</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>DATE</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>TIME</Text>
                  </View>
                </View>
              </View>

              {studentInfo &&
                studentInfo.map((student, index) => (
                  <View key={index} style={styles.tableRow} wrap>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {student.violation_offense}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {student.violation_description}
                      </Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {" "}
                        {student.violation_sanction}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {" "}
                        {format(new Date(student.createdAt), "MMMM d, yyyy")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {" "}
                        {format(new Date(student.createdAt), "h:mm a")}
                      </Text>
                    </View>
                  </View>
                ))}
              <View style={styles.wrapBottom} fixed>
                <Text style={styles.headName}>LILIAN O. SIDAMON</Text>
                <Text
                  style={{
                    fontFamily: "Arial-Italic",
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  Head, OSAS
                </Text>
              </View>
            </div>
          </div>
        </Page>
      </Document>
    </>
  );
}
