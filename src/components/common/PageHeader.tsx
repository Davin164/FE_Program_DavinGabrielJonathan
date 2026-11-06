import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  showBackButton = false,
  backHref,
  actions,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('mb-6 space-y-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-text-secondary mb-2">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                {isLast || !item.href ? (
                  <span className="font-medium text-text-primary">{item.label}</span>
                ) : (
                  <Link to={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
            {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};
