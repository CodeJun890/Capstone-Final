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
import { format } from "date-fns";

Font.register({ family: "Bookman-Bold", src: BookManBold });
Font.register({ family: "Bookman-Regular", src: BookManRegular });
Font.register({ family: "Century-Gothic", src: CenturyGothic });
Font.register({ family: "Century-Gothic-Bold", src: CenturyGothicBold });
Font.register({ family: "Quintessential-Regular", src: QuintessentialRegular });

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
  topWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "550px",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
    position: "relative",
  },
  middleWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "550px",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    position: "relative",
  },
  bottomWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "550px",
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    position: "relative",
  },
  table1: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    borderRightWidth: 1,
    fontWeight: "bold",
  },
  table1Text: {
    fontSize: "11px",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
  },
  table2: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
  },
  table3: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    borderRightWidth: 1,
    borderTopWidth: 1,
    paddingTop: 5,
    fontWeight: "bold",
    borderBottomWidth: 1,
  },
  table4: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 5,
  },
  table5: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
    paddingTop: 5,
  },
  table6: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
    borderRightWidth: 1,
  },
  table7: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
  },
  table8: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
    borderRightWidth: 1,
  },
  table9: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 0,
    fontWeight: "bold",
  },
  bodyInner1: {
    width: "100%",
    height: "90px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bodyInner2: {
    width: "100%",
    height: "160px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bodyInner3: {
    width: "100%",
    height: "225px",
    display: "flex",
    flexDirection: "row",
  },
  bodyInner4: {
    width: "100%",
    height: "75px",
    display: "flex",
    flexDirection: "row",
  },
  bodyInner5: {
    width: "100%",
    height: "50px",
    display: "flex",
    flexDirection: "row",
    borderWidth: 0,
  },
});

export default function IncidentReportPDF({ studentInfoIncident }) {
  const reportDate = format(
    new Date(studentInfoIncident.createdAt),
    "MMMM d, yyyy"
  );
  const reportTime = format(new Date(studentInfoIncident.createdAt), "h:mm a");
  const incidentDate = format(
    new Date(studentInfoIncident.createdAt),
    "MMMM d, yyyy"
  );
  const incidentTime = format(new Date(studentInfoIncident.time), "h:mm a");
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
            <Text style={styles.headerTxt5}>INCIDENT REPORT FORM</Text>

            <View style={styles.topWrap}>
              <View style={styles.bodyInner1}>
                <View style={styles.table1}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Date & Time Reported:
                      </Text>
                      <Text
                        style={{ alignSelf: "center", fontStyle: "italic" }}
                      >
                        (Petsa at oras ng ini-ulat)
                      </Text>
                      <Text style={{ marginTop: 5, alignSelf: "center" }}>
                        {reportDate}
                      </Text>
                      <Text style={{ marginTop: 3, alignSelf: "center" }}>
                        {reportTime}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.table2}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Place, Date & Time of Incident:
                      </Text>
                      <Text style={{ alignSelf: "center" }}>
                        (Lugar, Petsa, at oras ng pangyayari)
                      </Text>
                      <Text style={{ alignSelf: "center", marginTop: 5 }}>
                        {studentInfoIncident.place}
                      </Text>
                      <Text style={{ alignSelf: "center" }}>
                        {incidentDate}
                      </Text>
                      <Text style={{ alignSelf: "center" }}>
                        {incidentTime}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.bodyInner2}>
                <View style={styles.table3}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Person/s Involved:
                      </Text>
                      <Text
                        style={{ alignSelf: "center", fontStyle: "italic" }}
                      >
                        (Mga may kinalaman)
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          marginTop: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        {studentInfoIncident.persons_involved}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.table4}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Witness:
                      </Text>
                      <Text style={{ alignSelf: "center" }}>
                        (Saksi/Mga nakakita ng pangyayari)
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          marginTop: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        {studentInfoIncident.witness}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.middleWrap}>
              <View style={styles.bodyInner3}>
                <View style={styles.table5}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Brief Description of the Incident/Offense
                      </Text>
                      <Text
                        style={{ alignSelf: "center", fontStyle: "italic" }}
                      >
                        (Maikling salaysay tungkol sa pangyayari)
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          marginTop: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        {studentInfoIncident.incident_description}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.bottomWrap}>
              <View style={styles.bodyInner4}>
                <View style={styles.table6}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Reported by:
                      </Text>
                      <Text
                        style={{ alignSelf: "center", fontStyle: "italic" }}
                      >
                        (Isinalaysay ni)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.table7}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontFamily: "Century-Gothic-Bold",
                        }}
                      >
                        Noted By
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.bodyInner5}>
                <View style={styles.table8}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{ alignSelf: "center", marginBottom: -7 }}
                        fixed
                      >
                        {studentInfoIncident.reporter_name}
                      </Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          fontStyle: "italic",
                          marginTop: 10,
                          borderTopWidth: 1,
                          paddingTop: 5,
                        }}
                      >
                        (Name, Course, Yr. & Sec.)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.table9}>
                  <View style={styles.table1Text} fixed>
                    <View>
                      <Text
                        style={{
                          alignSelf: "center",
                          marginTop: 10,
                          borderTopWidth: 1,
                          paddingTop: 5,
                        }}
                      >
                        Guidance Counselor
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </div>
        </Page>
      </Document>
    </>
  );
}
