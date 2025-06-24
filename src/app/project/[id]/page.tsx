import { URL } from "@/api/cron/route";
import { Metadata } from "next";
import ProjectPage from "./projectPage";

async function getProject(id: string) {
  try {
    const response = await fetch(`${URL}/project`, {
      cache: "no-store",
    });

    const data = await response.json();

    // Find the project by _id
    const project = data.project.find((p: any) => p._id === id);

    return project || null;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const project = await getProject(id);

  const title = project?.title || "Default Project Title";
  const description = project?.details || "Default Project Description";
  const image =
    project?.image ||
    "https://res.cloudinary.com/nodelove/image/upload/f_auto,q_auto/v1/mdranju/ngpfp5vkd5ky5wfst2ec";

  return {
    title,
    description,
    keywords: project?.tags || ["projects", "portfolio", "example"],
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: title }],
      siteName: "Md Ranju Portfolio",
      type: "website",
      url: `https://mdranju.xyz/project/${id}`,
    },
    twitter: {
      title,
      description,
      images: [{ url: image, alt: title }],
      card: "summary_large_image",
      site: "@muhammad_ranju",
    },
  };
}

const Project = async ({ params }: { params: { id: string } }) => {
  const project = await getProject(params.id);

  if (!project) {
    return (
      <div className="text-center mt-28 text-2xl font-semibold text-red-500">
        Project not found.
      </div>
    );
  }

  return <ProjectPage project={project} />;
};

export default Project;
