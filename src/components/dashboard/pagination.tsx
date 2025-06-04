'use client';

import { ReactNode } from 'react';
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * Interface for the PaginationComponent props
 */
interface PaginationComponentProps {
  /**
   * Current page number
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Function to handle page change
   */
  onPageChange: (page: number) => void;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Optional children to render inside the pagination
   */
  children?: ReactNode;
}

/**
 * Centralized pagination component for use across all dashboard modules
 */
export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  children,
}: PaginationComponentProps) {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  // Function to handle page change with validation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    // For small number of pages, show all page numbers
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For large number of pages, show a subset with ellipsis
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show ellipsis if current page is far from the beginning
    if (currentPage > 3) {
      pageNumbers.push('ellipsis-start');
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - 2) {
      pageNumbers.push('ellipsis-end');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={`mt-4 ${className}`}>
      <UIPagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            {currentPage <= 1 ? (
              <PaginationPrevious className="pointer-events-none opacity-50" />
            ) : (
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            )}
          </PaginationItem>

          {/* Page numbers */}
          {getPageNumbers().map((pageNum, index) => {
            // Render ellipsis
            if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
              return (
                <PaginationItem key={`${pageNum}-${index}`}>
                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                </PaginationItem>
              );
            }
            
            // Render page number
            return (
              <PaginationItem key={`page-${pageNum}`}>
                <PaginationLink 
                  onClick={() => handlePageChange(pageNum as number)} 
                  isActive={pageNum === currentPage}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next button */}
          <PaginationItem>
            {currentPage >= totalPages ? (
              <PaginationNext className="pointer-events-none opacity-50" />
            ) : (
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            )}
          </PaginationItem>
          
          {/* Optional children */}
          {children}
        </PaginationContent>
      </UIPagination>
    </div>
  );
}