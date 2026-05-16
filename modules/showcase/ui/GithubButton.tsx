import { Button } from "@/modules/ui/Button";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SHOWCASE_LINKS } from "@/libs/config/showcase.config";

export function GithubButton() {
    function onClick() {
        window.open(SHOWCASE_LINKS.github, "_blank");
    }

    return (
        <Button variant="outline" size="sm" onClick={onClick} iconLeft={<FontAwesomeIcon icon={faGithub} />}>
        </Button>
    );
}