import { getResponsiveImageProps } from "../../utils/imageVariants";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { IoMdBookmarks, IoIosMail, IoIosMailOpen } from "react-icons/io";
import { useState } from "react";

import { getScrapDecoration } from "../../utils/getScrapDecoration";

import "./LaDupla.css";

export default function UnaDupla({ name, role, description, image, layout, decorations = [], decorationsData = [], linkedin, instagram, cv, email }) {
    const [copied, setCopied] = useState(false);
    const pin = getScrapDecoration(decorationsData, decorations, "pin");
    const tape = getScrapDecoration(decorationsData, decorations, "tape");
    
    return (
        <section className={`about-section ${layout} scrap-base ${pin?.className || ""} `}  style={pin?.style}>
            <div className={`about-section-header ${layout}`}>
                <div className={`scrap-base ${layout} ${tape?.className || ""}`}  style={tape?.style}>
                    
                    {image && image.sizes && (
                        <img 
                            {...getResponsiveImageProps({
                                image: image,
                                sizes: "(max-width: 768px) 60vw, 30vw"
                            })}
                            alt={name}
                            className="about-photo"
                        />
                    )}
                </div>
                <div className="about-section-header-text">
                    <h2>{name}</h2>
                    <span className="role">{role}</span>
                </div>
            </div>
            <div className="about-body">
                <div className="about-text">
                    {description?.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
                <span></span>
            </div>
            <div className="about-contacts">
                <h3>Contacto:</h3>
                <ul className="about-list">
                    <li>
                        <a href={linkedin} target="_blank" rel="noreferrer" ><FaLinkedinIn /> Linkedin</a>
                    </li>
                    <li>
                        <a href={instagram} target="_blank" rel="noreferrer" ><FaInstagram /> Instagram</a>
                    </li>
                    <li>
                        <a href={cv} target="_blank" rel="noreferrer" ><IoMdBookmarks /> CV</a>
                    </li>
                    <li>
                        <span
                            className={`about-link ${copied ? "copied" : ""}`}
                            onClick={() => {
                                navigator.clipboard.writeText(email);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1500);
                            }}
                        > 
                            {copied ? <IoIosMailOpen /> : <IoIosMail />}
                            {copied ? "Copiado!" : email}
                        </span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
