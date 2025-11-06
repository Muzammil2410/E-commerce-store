import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Zizla. - Admin",
    description: "Zizla. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
