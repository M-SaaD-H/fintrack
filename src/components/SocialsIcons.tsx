import { IconBrandInstagram, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type SocialIconLinks = {
  instagram?: string,
  linkedin?: string,
  x?: string,
  iconSize?: string,
  className?: string
}

const SocialIcons: React.FC<SocialIconLinks> = ({
  instagram = 'https://www.instagram.com/_m_saad_h',
  linkedin = 'https://www.linkedin.com/in/muhammad-saad-haider-942167317/',
  x = 'https://x.com/_MSaaDH',
  iconSize = '28',
  className = ""
}) => {
  return (
    <div className={`flex gap-4 my-5 w-max ${className}`}>
      <div className='cursor-pointer'>
        <Link href={instagram} target='blank'><IconBrandInstagram size={iconSize} /></Link>
      </div>
      <div className='cursor-pointer]'>
        <Link href={linkedin} target='blank'><IconBrandLinkedin size={iconSize} /></Link>
      </div>
      <div className='cursor-pointer'>
        <Link href={x} target='blank'><IconBrandX size={iconSize} /></Link>
      </div>
    </div>
  )
};

export default SocialIcons;