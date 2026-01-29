import { getResponsiveImageProps } from "../../utils/imageVariants";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { IoMdBookmarks, IoIosMail } from "react-icons/io";

import "./LaDupla.css";

export default function unaDupla({ name, role, description, image, layout, linkedin, instagram, cv, email }) {
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
                <span>{role}</span>
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
                        <a href={email} target="_blank" rel="noreferrer" ><IoIosMail /> Mail</a>
                    </li>
                </ul>
             </div>
        </section>
    );
}
