import {apiClient} from "../lib/api-client";

async function updateAD() {
  await apiClient.post<null>("/api/update");
}

export default async function onUpdateAD() {
  try {
      await updateAD();
      window.location.reload()
  } catch (error) {
    alert((error as Error).message);
  }
}
