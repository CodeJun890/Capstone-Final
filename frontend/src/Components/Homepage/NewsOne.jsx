import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function NewsOne() {
  return (
    <>
      <div className="banner-item">
        <div
          className="image-overlay-vision-mission"
          style={{ backgroundImage: `url(${CampusImage1})` }}
        ></div>
        <div className="breadcrumb-container">
          <div className="h2 fw-bold text-light">
            Cavite State University Trece Campus
          </div>
          <Breadcrumb>
            <Link to="/" className=" me-2">
              Home
            </Link>
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="fas fa-angle-double-right"
              style={{ fontSize: "1.25rem" }}
            />
            <Breadcrumb.Item className=" text-light ms-2" active>
              News & Updates
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          Bakasyon sa Bansa, Aprubado na nga ba?
        </div>
        <div className="lead mt-5 text-justify indent">
          Nagbukas ng pahayag ang Department of Tourism (DOT) nito lamang ika-27
          ng Pebrero 2021 ukol sa muling pagbubukas ng turismo sa iba’t-ibang
          bahagi ng bansa. Aprubado rin ng kagawaran ang mga protokol na
          itinakda ng Inter-Agency Task Force (IATF) sa mas ligtas na
          paglalakbay sa lahat ng Local Government Unit (LGU). Ito ay isinagawa
          upang mapalakas ang turismo ng bansa. Kasabay ng pahayag na ito ay ang
          unti-unting pagbubukas ng mga patok na pookpasyalan sa Pilipinas.
        </div>
        <div className="lead mt-3 text-justify indent">
          Suportado ng DOT Secretary Bernadette Romulo-Puyat sa desisyong ng
          tagapamahala ng Puerto Princesa City na muling magbukas sa publiko
          ngunit kinakailangan ang pagsunod sa pamantayan na itinakda ng IATF
          ukol sa pagpapatupad ng ligtas na pakikipaginteraksyon sa isa’t-isa.
          Napaulat rin na magbubukas ang isa pang bahagi ng Palawan, ang Coron,
          upang mainit na salubungin ang mga turista sa kanilang lugar. “Giving
          our recovery plans for Coron a major boost is the Sustainable Tour-
          ism Development Project or STDP, which will be launched this year and
          will run throughout 2026”,pahayag ni DOT Secretary Bernadette Romu-
          lo-Puyat sa diskusyon kasama ang mga stakeholders noong ika-4 ng Marso
          2021.
        </div>
        <div className="lead mt-3 text-justify indent">
          Matatandaang sumang-ayon ang DOT sa pahayag ng LGU ng Baguio na muling
          buksan ang turismo ng lungsod sa mamamayan ng Luzon partikular na sa
          National Capital Region (NCR) at mga rehiyon 2 at 3 noong ika-3 ng
          Oktubre noong nakaraang taon. Iginiit ng mga ito na lubhang
          mapalalakas ang turismo sa muling pagdagsa ng mga turista sa nasabing
          lungsod. Nakalulungkot isipin na sa kadahilanang bagsak ang ekonomiya
          ng bansa, turismo ang isa sa may pinakamalaking ambag upang
          matulungang umangat ang ekonomiya ng Pilipinas. Sa kabilang dako, ito
          rin ang isa sa pinakamalaking dahilan upang patuloy na lumaganap ang
          dami ng naitatalang kaso dulot ng Coronavirus Disease- 2019
          (COVID-19). Ang pagkainip sa bahay ay isa sa mga dahilan upang
          maisipan ng mga iilan ang pagbabakasyon. Ilan din sa mga artista ay
          nagbahagi ng kani-kanilang larawan sa nstagram habang naglalakbay sa
          loob ng bansa. Ang kanilang impluwensya ay isa sa mga hudyat sa
          mamamayan na huwag matakot sa sakit na ito at patuloy na lumbas ng
          bahay sa tuwing nabuburyong o may okasyon.
        </div>
        <div className="lead mt-3 text-justify indent">
          Lubos na nakababahala ang epekto ng pandemyang ito. Pagsasara ng
          samu’t-saring negosyo, pagkagutom ng mga mamamayan at pagkamatay ng
          hindi bababa sa labing-tatlong milyong Pilipino ang dulot ng sakit na
          ito. Palaisipan na sa bawat mamamayan kung magtitiis sa mahigpit
          ngunit maikling pananatili sa bahay o panakaw na paglalakbay ngunit
          mas mahabang pagkaburyong sa tahanan. Tanging may bukas na isipan
          lamang ang makakahanap ng sagot sa palaisipang ito. Bawat araw, walang
          Pilipino ang hindi naapektuhan ng pandemyang ito. Gayunpaman, aprubado
          na ng nakatataas ang pagbabakasyon sa bansa ngunit kinakailangan
          lamang ng tamang pagsunod sa paggamit ng facemask at face shield upang
          malimitahan ang dumaraming kaso ng COVID – 19.
        </div>
      </div>
    </>
  );
}
