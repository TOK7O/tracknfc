import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UseSidebarLogicProps {
    links: string[];
    onOptimisticAdd: (slug: string) => void;
    onOptimisticDelete: (slug: string) => void;
    onRefresh: () => void;
}

export function useSidebarLogic({ links, onOptimisticAdd, onOptimisticDelete, onRefresh }: UseSidebarLogicProps) {
    const { logout } = useAuth();

    const [newSlug, setNewSlug] = useState('');
    const [newTarget, setNewTarget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (links.includes(newSlug)) {
            toast.error('Ten slug już istnieje!');
            return;
        }
        setIsSubmitting(true);
        onOptimisticAdd(newSlug);
        const tempSlug = newSlug;
        setNewSlug('');
        setNewTarget('');

        try {
            await api.links.create({ slug: tempSlug, targetUrl: newTarget });
            toast.success('Link utworzony!');
        } catch (e: any) {
            onOptimisticDelete(tempSlug);
            setNewSlug(tempSlug);
            toast.error(e.message || 'Błąd zapisu');
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestDelete = (slug: string) => {
        setSlugToDelete(slug);
        setDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setSlugToDelete(null);
    };

    const confirmDelete = async (cleanup: boolean) => {
        if (!slugToDelete) return;

        setIsDeleting(true);
        onOptimisticDelete(slugToDelete);

        try {
            await api.links.delete(slugToDelete, cleanup);
            toast.success(cleanup ? 'Usunięto link i dane' : 'Usunięto link (dane zachowano)');
        } catch {
            toast.error('Błąd usuwania');
            onRefresh();
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setSlugToDelete(null);
        }
    };

    return {
        newSlug,
        setNewSlug,
        newTarget,
        setNewTarget,
        isSubmitting,
        handleCreate,
        logout,
        requestDelete,
        confirmDelete,
        cancelDelete,
        deleteModalOpen,
        slugToDelete,
        isDeleting
    };
}