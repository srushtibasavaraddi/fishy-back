import React, { useState, useContext, useEffect } from "react";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import FlashCard from "../../../components/Flashcard/Flashcard";
import { SocketContext } from "../../../context/SocketContext";
import { Link } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";
import Settings from "../Settings/Settings";
import Icons from "../../../components/Icons/Icons";
import Rules from "../../Rules/Rules";
import NavComponent from "../../../components/NavComponent";
import Tab from "react-bootstrap/Tab";
import "./GenerateLink.css";
import PlayerScreen from "../../../screens/Player/PlayerScreen/PlayerScreen";
import Refresh from "../../../images/refresh.png";
import SettingIcon from "../../../images/settings.png";

const GenerateLink = () => {
  const socket = useContext(SocketContext);
  const [code, setCode] = useState("");
  const [settings, showSettings] = useState(false);
  const [rules, showRules] = useState(false);
  useEffect(() => {
    sessionStorage.setItem("status", 1);
  });

  const generateCode = () => {
    setCode(Math.floor(100000 + Math.random() * 900000));
  };

  const ClickHandler = () => {
    let room = code;
    socket.emit("join", { room });
  };

  const ruleHandler = () => {
    showRules(!rules);
  };
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col justify-center items-start w-full">
        <div className="block mt-2">
          <Icons
            icon={SettingIcon}
            clickHandler={() => showSettings(!settings)}
          />
        </div>
        <div className="inline-block ml-auto mr-auto mt-3">
          <FlashCard text={"Fishy Equilibrium"} />
        </div>
      </div>
      <div className="max-w-7xl self-center ml-auto mr-auto">
        <NavComponent ekey="profile">
          <Tab eventKey="home" title="Join" tabClassName="w-100">
            <PlayerScreen />
          </Tab>
          <Tab eventKey="profile" title="Host" tabClassName="w-100 flex-grow-1">
            {code ? (
              <div className="flex flex-row justify-center items-center p-8">
                <Heading
                  display={
                    "text-center font-normal md:text-xl inline-block text-warning p-3"
                  }
                  text={`Room Code: ${code}`}
                />
                <Icons
                  icon={Refresh}
                  title={"Refresh"}
                  clickHandler={generateCode}
                />
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center p-8 gen-btn">
                <Button
                  display={"btn btn-warning btn-lg inline-block"}
                  text={"Generate Game Code"}
                  clickHandler={generateCode}
                />
              </div>
            )}
          </Tab>
        </NavComponent>
      </div>
      <div className="flex justify-around items-end h-full flex-row w-full">
        <div className="p-2">
          <Icons
            icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`}
            title={`Rules`}
            clickHandler={ruleHandler}
          />
        </div>
        <div></div>
      </div>
      {code ? (
        <Link
          to={{
            pathname: `/lobby/${code}`,
            aboutProps: {
              value: { code },
            },
          }}
        >
          <Button
            display={
              "bg-btn-bg-primary bg-center text-warning btn-lg absolute bottom-5 right-5"
            }
            text={"Next"}
            clickHandler={ClickHandler}
          />
        </Link>
      ) : null}

      {settings ? (
        <Modal>
          <Settings showSettings={() => showSettings(false)} />
        </Modal>
      ) : null}

      {rules ? (
        <Modal>
          <Rules showRules={() => showRules(false)} />
        </Modal>
      ) : null}
    </div>
  );
};

export default GenerateLink;
