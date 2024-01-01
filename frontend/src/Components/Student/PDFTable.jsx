import React from "react";
import {
  Page,
  Text,
  Image,
  Document,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import CvsuLogo from "../../Assets/cvsu-docs.png";
import PhoneIcon from "../../Assets/phone.png";
import Font1 from "../../fonts/CenturyGothic.ttf";
import Font2 from "../../fonts/CenturyGothicBold.ttf";
import Font3 from "../../fonts/Quintessential-Regular.ttf";
import Font4 from "../../fonts/Bookman Old Style Regular.ttf";
import Font5 from "../../fonts/Bookman Old Style Bold.ttf";

// Register font
Font.register({
  family: "Century Gothic",
  src: Font1, // Set the font weight here
});
Font.register({
  family: "Century Gothic Bold",
  src: Font2,
});
Font.register({ family: "Quintessential", src: Font3 });
Font.register({ family: "Bookman Old Style", src: Font4 });
Font.register({ family: "Bookman Old Style Bold", src: Font5 });

const styles = StyleSheet.create({
  body: {
    paddingTop: 40,
    paddingBottom: 65,
    paddingHorizontal: 35,
    width: "100%",
  },
  logo: {
    width: "70px",
    position: "absolute",
    left: "16%",
  },
  phone: {
    width: "9px",
  },
  headerText: {
    marginLeft: 20,
    alignItems: "center",
  },
  header1: {
    fontSize: 12,
    fontFamily: "Century Gothic",
  },
  header2: {
    fontSize: 14,
    fontFamily: "Bookman Old Style Bold",
  },
  header3: {
    fontSize: 12,
    fontFamily: "Century Gothic Bold",
  },
  header4: {
    fontSize: 10,
    fontFamily: "Quintessential",
  },
  header5: {
    fontSize: 10,
    fontFamily: "Century Gothic",
  },
});

function PDFTable() {
  return (
    <Document>
      <Page style={styles.body}>
        <View>
          <Image style={styles.logo} src={CvsuLogo} />
          <View style={styles.headerText}>
            <Text style={styles.header1}>Republic of the Philippines</Text>
            <Text style={styles.header2}>CAVITE STATE UNIVERSITY</Text>
            <Text style={styles.header3}>Trece Martires City</Text>
            <Text style={styles.header4}>
              <Image style={styles.phone} src={PhoneIcon} /> 046 866 4981
            </Text>
            <Link style={styles.header5}>www.cvsu.edu.ph</Link>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default PDFTable;
