import { getResponsiveImageProps } from "../../utils/imageVariants";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { IoMdBookmarks, IoIosMail, IoIosMailOpen } from "react-icons/io";
import { useState } from "react";
import "./LaDupla.css";

export default function UnaDupla({ name, role, description, image, layout, linkedin, instagram, cv, email }) {
    const [copied, setCopied] = useState(false);

    return (
        <section className={`about-section ${layout}`}>
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
                    
            <div className="about-text">
                <h2>{name}</h2>
                <span className="role">{role}</span>
                {description?.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
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
