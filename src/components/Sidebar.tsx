import { useSidebarLogic } from '../hooks/useSidebarLogic';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { CreateLinkForm } from './sidebar/CreateLinkForm';
import { LinkList } from './sidebar/LinkList';
import { DeleteModal } from './sidebar/DeleteModal';

interface SidebarProps {
    links: string[];
    selectedSlug: string | null;
    onSelectSlug: (slug: string | null) => void;
    onRefresh: () => void;
    onOptimisticAdd: (slug: string) => void;
    onOptimisticDelete: (slug: string) => void;
}

export function Sidebar({
                            links, selectedSlug, onSelectSlug,
                            onRefresh, onOptimisticAdd, onOptimisticDelete
                        }: SidebarProps) {

    const {
        newSlug, setNewSlug,
        newTarget, setNewTarget,
        isSubmitting,
        handleCreate,
        requestDelete,
        confirmDelete,
        cancelDelete,
        deleteModalOpen,
        slugToDelete,
        isDeleting,

        logout
    } = useSidebarLogic({ links, onOptimisticAdd, onOptimisticDelete, onRefresh });

    return (
        <>
            <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-10">

                <SidebarHeader
                    onLogout={logout}
                />

                <CreateLinkForm
                    newSlug={newSlug}
                    setNewSlug={setNewSlug}
                    newTarget={newTarget}
                    setNewTarget={setNewTarget}
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreate}
                />

                <LinkList
                    links={links}
                    selectedSlug={selectedSlug}
                    onSelect={onSelectSlug}
                    onDelete={requestDelete}
                />

            </aside>
            <DeleteModal
                isOpen={deleteModalOpen}
                slug={slugToDelete}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}