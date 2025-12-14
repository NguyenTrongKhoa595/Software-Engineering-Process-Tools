import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Logo = () => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    if (role === "LANDLORD" || role === "PROPERTY_MANAGER") {
      router.push("/landlord");
    } else if (role === "TENANT") {
      router.push("/tenant");
    } else {
      router.push("/"); // fallback, maybe login page
    }
  };

  return (
    <Box
      fontSize="2xl"
      fontWeight="bold"
      color="blue.500"
      cursor="pointer"
      onClick={handleClick}
    >
      RentMate
    </Box>
  );
};

export default Logo;
