"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdOpenInNew } from "react-icons/md";
import parse from "html-react-parser";
import { useState } from "react";
import YouTube from "react-youtube";
import { Controlled } from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

type Project = {
  id: string;
  title: string;
  details: string;
  longDetails: string;
  backendSourceCode: string;
  tags: string[];
  category: string;
  author: string;
  avatar: string;
  createdAt: string;
  sourceCode: string;
  liveLink: string;
  image: string;
  slideshowImages?: string[];
};

type MediaSliderProps = {
  mediaItems: string[];
};

const MediaSlider = ({ mediaItems }: MediaSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const isYouTubeUrl = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const currentMedia = mediaItems[activeIndex];

  const youtubeOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: isVideoPlaying ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="w-full">
      {/* Main Media */}
      <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 relative">
        {isYouTubeUrl(currentMedia) ? (
          <YouTube
            videoId={getYouTubeId(currentMedia) || ""}
            opts={youtubeOpts}
            onPlay={() => setIsVideoPlaying(true)}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        ) : (
          <Controlled
            isZoomed={isZoomed}
            onZoomChange={(zoom: boolean) => setIsZoomed(zoom)}
          >
            <Image
              src={currentMedia || "/fallback.jpg"}
              width={1280}
              height={720}
              alt="Slide"
              className="w-full h-full object-cover"
              priority
            />
          </Controlled>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto mt-4 pb-2">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setIsVideoPlaying(false);
            }}
            className={`cursor-pointer border-2 rounded-md overflow-hidden ${
              activeIndex === index
                ? "border-indigo-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            {isYouTubeUrl(item) ? (
              <div className="relative w-28 h-16 bg-black">
                <Image
                  src={`https://img.youtube.com/vi/${getYouTubeId(item)}/hqdefault.jpg`}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 opacity-80"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-4.586-2.65A1 1 0 009 9.382v5.236a1 1 0 001.166.984l4.586-2.65a1 1 0 000-1.732z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <Image
                src={item}
                alt={`Thumbnail ${index + 1}`}
                width={112}
                height={64}
                className="w-28 h-16 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectPage = ({ project }: { project: Project }) => {
  const router = useRouter();
  const mediaItems = project.slideshowImages?.length
    ? project.slideshowImages
    : [project.image];

  return (
    <div className="p-8 max-w-7xl mx-auto mt-28 mb-10 bg-slate-100 dark:bg-[#020617] rounded-xl border border-slate-500/10">
      <div className="pb-5">
        <HoverBorderGradient
          onClick={() => router.back()}
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-slate-800 bg-slate-100 text-sm text-slate-700 dark:text-slate-100 flex items-center"
        >
          <IoIosArrowBack className="text-lg mr-1 -ml-2" /> Back
        </HoverBorderGradient>
      </div>

      <MediaSlider mediaItems={mediaItems} />

      <div className="mt-6">
        <span className="p-2 text-xs mb-10 border-2 rounded-full">#{project.category}</span>
        <h2 className="lg:text-3xl text-xl font-bold mt-5">{project.title}</h2>
        <p className="mt-2 lg:max-w-5xl lg:text-base text-sm">{project.details}</p>

        {project.longDetails && (
          <div className="mt-4 prose dark:prose-invert max-w-none">
            {parse(project.longDetails)}
          </div>
        )}

        {project.tags.length > 0 && (
          <div className="flex mt-4 flex-wrap items-center space-x-2">
            <span className="font-semibold">Tags:</span>
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs border rounded-full">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-x-2">
          <Image
            width={48}
            height={48}
            src={project.avatar}
            className="w-12 h-12 rounded-lg"
            alt={project.author}
          />
          <div>
            <p>{project.author}</p>
            <span className="text-xs">
              Added At: {format(new Date(project.createdAt), "dd/MM/yyyy")}
            </span>
          </div>
        </div>

        <div className="flex items-center mt-6 gap-x-5 flex-wrap gap-y-3">
          <a href={project.sourceCode} target="_blank" rel="noopener noreferrer">
            <HoverBorderGradient
              containerClassName="rounded-lg"
              as="button"
              className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2 px-4 py-2"
            >
              <FaGithub className="text-lg mr-2" />
              <span>Github</span>
            </HoverBorderGradient>
          </a>

          {project.backendSourceCode && (
            <a href={project.backendSourceCode} target="_blank" rel="noopener noreferrer">
              <HoverBorderGradient
                containerClassName="rounded-lg"
                as="button"
                className="dark:bg-slate-800 bg-slate-100 text-slate-700 dark:text-slate-100 flex items-center space-x-2 px-4 py-2"
              >
                <FaGithub className="text-lg mr-2" />
                <span>Backend</span>
              </HoverBorderGradient>
            </a>
          )}

          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
              <HoverBorderGradient
                containerClassName="rounded-lg"
                as="button"
                className="bg-indigo-500 text-white flex items-center space-x-2 px-4 py-2"
              >
                <MdOpenInNew className="text-lg mr-2" />
                <span>Live Demo</span>
              </HoverBorderGradient>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
