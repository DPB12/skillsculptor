import { DiJavascript1, DiNodejs, DiPython, DiJava, DiRuby, DiSwift, DiSass, DiBootstrap, DiGit, DiReact, DiSymfony } from "react-icons/di";
import { FaHtml5, FaCss3Alt, FaPhp, FaVuejs, FaLaravel, FaAngular, FaWordpress, FaGithub } from "react-icons/fa";
import { SiTypescript, SiDjango, SiDotnet, SiCsharp, SiCplusplus, SiTailwindcss, SiUnity, SiVisualstudiocode } from "react-icons/si";

export const useIcons = () => {
    const iconsMap = {
        HTML: <FaHtml5 />,
        CSS: <FaCss3Alt />,
        JavaScript: <DiJavascript1 />,
        NodeJS: <DiNodejs />,
        Python: <DiPython />,
        Java: <DiJava />,
        PHP: <FaPhp />,
        VueJS: <FaVuejs />,
        React: <DiReact />,
        Symfony: <DiSymfony />,
        Laravel: <FaLaravel />,
        TypeScript: <SiTypescript />,
        Angular: <FaAngular />,
        Django: <SiDjango />,
        Wordpress: <FaWordpress />,
        "C#": <SiCsharp />,
        ".NET": <SiDotnet />,
        Ruby: <DiRuby />,
        "C++": <SiCplusplus />,
        SASS: <DiSass />,
        Unity: <SiUnity />,
        Bootstrap: <DiBootstrap />,
        Tailwind: <SiTailwindcss />,
        Git: <DiGit />,
        GitHub: <FaGithub />,
        "VS Code": <SiVisualstudiocode />,
    };

    return iconsMap;
};
