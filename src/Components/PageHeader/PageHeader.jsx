import { useNavigate } from "react-router-dom";
import * as ReactIconsFA from "react-icons/fa";

import * as ReactIcons from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

import "./PageHeader.css";

const PageHeader = ({ title, backPath = -1 }) => {
    const navigate = useNavigate();

    return (
        <div className="top-view">
            <button
                className="back-button"
                onClick={() => navigate(backPath)}
            >
                <IoIosArrowBack className="back-arrow" /> Back
            </button>
            
            <h2>{title}</h2>
        </div>
    );
};

export default PageHeader;
