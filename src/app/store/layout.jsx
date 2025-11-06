import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Zizla. - Store Dashboard",
    description: "Zizla. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
