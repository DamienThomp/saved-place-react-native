export default async (data: Blob): Promise<string> => {
  return new Promise<string>((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(data);

    fr.onload = () => {
      const result = fr.result as string;
      resolve(result);
    };
  });
};
