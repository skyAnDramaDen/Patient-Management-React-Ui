import { useNavigate } from "react-router-dom";

import "./PageHeader.css";

const PageHeader = ({ title, backPath = -1 }) => {
    const navigate = useNavigate();

    return (
        <div className="top-view">
            <button
                className="back-button"
                onClick={() => navigate(backPath)}
            >
                🔙 Back
            </button>
            <h2>{title}</h2>
        </div>
    );
};

export default PageHeader;
