// Custom Toast Functions

// For displaying success message in toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const successToast = (toast: any, message: string) => {
  toast({
    title: "Success",
    description: message,
    style: {
      color: "#2ecc71",
      textAlign: "justify",
    },
  });
};

// For displaying error message in toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorToast = (toast: any, message: string) => {
  toast({
    title: "Error",
    description: message,
    style: {
      color: "#e74c3c",
      textAlign: "justify",
    },
  });
};
