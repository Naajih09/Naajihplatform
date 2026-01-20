'use client';

import { Pagination } from 'react-headless-pagination';

import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '.';

type Props = {
  page: number;
  pageSize: number;
  setPage(page: number): void;
  toFirstPage(): void;
  toLastPage(): void;
  setPageSize(pageSize: number): void;
  totalPages: number;
  totalItems: number;
  canNext?: boolean;
  canPrev?: boolean;
  hidePageStat?: boolean;
  edgeCount?: number;
  className?: string;
  middlePageSiblingsCount?: number;
};

export function Paginator({
  page,
  setPage,
  totalPages,
  canPrev,
  canNext,
  edgeCount = 2,
  middlePageSiblingsCount = 2,
  className,
}: Props) {
  const truncableDisplay = 'hidden lg:!flex'; // hide truncable on mobile
  return (
    <>
      <style>
        {`
            .paginator__truncable {
              display: ${truncableDisplay};
              justify-content: center;
              align-items: center;
              border-color: #E9E5E5;
              border-width: 1px;
              color: #2F2B43;
              border-radius: 10px;
              cursor: default;
              height: 49px;
              width: 45px;
            
            }
          `}
      </style>

      <div
        className={cn(
          'flex flex-wrap items-center space-x-3 space-y-6 w-full px-3',
          'justify-center lg:!justify-between  ',
          className
        )}
      >
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
          middlePagesSiblingCount={middlePageSiblingsCount}
          edgePageCount={edgeCount}
          truncableClassName="paginator__truncable"
          className=" w-full flex px-3"
        >
          <div className="flex gap-2 w-full flex-wrap justify-between items-center">
            <Pagination.PrevButton>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-sm min-w-[59px] min-h-[37px] rounded-[8px] text-sm bg-white"
                      disabled={!canPrev}
                    >
                      Previous
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Previous Page</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Pagination.PrevButton>

            <nav className="flex justify-center items-center flex-wrap ">
              <ul className="hidden lg:!flex justify-center items-center gap-2 list-none">
                <li>
                  <a className="px-2 flex justify-center items-center gap-4 cursor-pointer  w-fit min-w-[292px] text-sm transition-all duration-300  ">
                    <Pagination.PageButton
                      activeClassName=" bg-brand-100   p-2"
                      inactiveClassName=""
                      className="text-[#667085]  w-[40px]  h-[40px] rounded-full p-2"
                    />
                  </a>
                </li>
              </ul>
            </nav>

            <Pagination.NextButton>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-sm min-w-[59px] min-h-[37px] rounded-[8px] text-sm bg-white"
                      disabled={!canNext}
                    >
                      Next
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Next Page</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Pagination.NextButton>
          </div>
        </Pagination>
      </div>
    </>
  );
}
