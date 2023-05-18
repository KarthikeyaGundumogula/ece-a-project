import title from "./title.png";
import Image from "next/image";

const Header = () => {
  
  return (
    <div>
      <Image
        src={title}
        alt="title"
        height={0}
        width={0}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default Header;
