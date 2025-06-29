export const URL = "https://server-the-other-way.vercel.app/v1/api";
export const URL_V2 = "https://portfolio-project-api-sooty.vercel.app/v2/api";

// const URL = "https://portfolio-project-api.onrender.com/v1/api/project";

async function getProject() {
  const data = await fetch(`${URL}/project`, {
    next: {
      revalidate: 60 * 60 * 12,
    },
  });
  const result = await data.json();
  return result;
}

export default getProject;
