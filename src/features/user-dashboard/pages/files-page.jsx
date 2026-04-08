import { useState } from "react";
import {
  FileText,
  FolderOpen,
  Video,
  FileArchive,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Star,
  Clock,
  Users,
  Search,
  Grid,
  List,
  ChevronRight,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import { UserLayout } from "../components/user-layout";

const mockCategories = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "starred", label: "Starred", icon: Star },
  { id: "all", label: "My Files", icon: FolderOpen },
  { id: "shared", label: "Shared", icon: Users },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const mockFiles = [
  { id: 1, name: "Project_Alpha_Q3_Report.pdf", type: "pdf", size: "2.4 MB", modified: "10 mins ago", owner: "You", starred: true },
  { id: 2, name: "Marketing_Assets_2024", type: "folder", size: "--", modified: "2 hours ago", owner: "Sarah Jenkins", starred: false },
  { id: 3, name: "Client_Feedback_v2.docx", type: "doc", size: "1.1 MB", modified: "Yesterday", owner: "You", starred: false },
  { id: 4, name: "Q4_Budget_Forecast.xlsx", type: "sheet", size: "4.8 MB", modified: "Yesterday", owner: "Finance Team", starred: true },
  { id: 5, name: "Hero_Image_Final.png", type: "image", size: "8.2 MB", modified: "3 days ago", owner: "Design Team", starred: false },
  { id: 6, name: "Team_All_Hands_Recording.mp4", type: "video", size: "450 MB", modified: "Last week", owner: "You", starred: false },
  { id: 7, name: "Source_Code_Backup.zip", type: "archive", size: "120 MB", modified: "Last month", owner: "Engineering", starred: false },
];

const typeColors = {
  folder: { icon: FolderOpen, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  pdf:    { icon: FileText,   color: "text-red-500",  bg: "bg-red-50",  border: "border-red-100" },
  doc:    { icon: FileText,   color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  sheet:  { icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  image:  { icon: FileImage,  color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
  video:  { icon: Video,      color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-100" },
  archive:{ icon: FileArchive,color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
};

function FileIcon({ type, size = "size-7" }) {
  const config = typeColors[type] || typeColors.pdf;
  const Icon = config.icon;
  return (
    <div className={`flex items-center justify-center rounded-2xl ${config.bg} ${config.border} border p-3`}>
      <Icon className={`${size} ${config.color}`} />
    </div>
  );
}

export function FilesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = mockFiles.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory === "starred" && !item.starred) return false;
    return true;
  });

  return (
    <UserLayout>
      <div className="flex flex-col gap-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white border border-brand-line rounded-2xl p-1.5 shadow-sm overflow-x-auto">
            {mockCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : "text-brand-secondary hover:bg-brand-neutral hover:text-brand-ink"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search + View Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-secondary group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 bg-white border border-brand-line rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-brand-secondary shadow-sm"
              />
            </div>
            <div className="flex items-center bg-white border border-brand-line rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-brand-primary text-white shadow-sm" : "text-brand-secondary hover:text-brand-ink"}`}
              >
                <Grid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-brand-primary text-white shadow-sm" : "text-brand-secondary hover:text-brand-ink"}`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-brand-secondary hover:text-brand-primary cursor-pointer transition-colors">My Files</span>
          <ChevronRight className="size-4 text-brand-line" />
          <span className="text-brand-ink">{mockCategories.find(c => c.id === activeCategory)?.label}</span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-brand-secondary/50 bg-brand-neutral px-2 py-1 rounded-full">
            {filteredFiles.length} items
          </span>
        </div>

        {/* Files Content */}
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-20 rounded-full bg-brand-soft flex items-center justify-center mb-6">
              <FolderOpen className="size-10 text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold text-brand-ink mb-2">No files found</h3>
            <p className="text-brand-secondary max-w-sm text-sm leading-7">
              There are no files matching your current search or category.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group relative bg-white border border-brand-line rounded-[24px] p-4 hover:border-brand-primary/40 hover:shadow-[0_8px_30px_rgba(68,83,74,0.10)] transition-all duration-300 cursor-pointer flex flex-col gap-3"
              >
                {/* Actions on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-white border border-brand-line shadow-sm hover:text-brand-primary transition-colors">
                    <MoreVertical className="size-3.5" />
                  </button>
                </div>

                {/* Star badge */}
                {file.starred && (
                  <div className="absolute top-3 left-3">
                    <Star className="size-3.5 text-amber-400 fill-amber-400" />
                  </div>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center pt-4 pb-2">
                  <FileIcon type={file.type} size="size-9" />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-brand-ink line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                    {file.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-brand-secondary font-semibold uppercase tracking-wide">{file.modified}</p>
                    <p className="text-[10px] text-brand-secondary font-semibold">{file.size}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-brand-line rounded-[24px] overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-neutral border-b border-brand-line">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Owner</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Modified</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Size</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line/50">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-brand-soft/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileIcon type={file.type} size="size-5" />
                        <span className="font-semibold text-brand-ink group-hover:text-brand-primary transition-colors">
                          {file.name}
                        </span>
                        {file.starred && <Star className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-secondary">{file.owner}</td>
                    <td className="px-6 py-4 text-brand-secondary">{file.modified}</td>
                    <td className="px-6 py-4 text-brand-secondary">{file.size}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-brand-soft rounded-lg hover:text-brand-primary transition-colors text-brand-secondary">
                          <Share2 className="size-4" />
                        </button>
                        <button className="p-1.5 hover:bg-brand-soft rounded-lg hover:text-brand-primary transition-colors text-brand-secondary">
                          <Download className="size-4" />
                        </button>
                        <button className="p-1.5 hover:bg-brand-soft rounded-lg hover:text-brand-primary transition-colors text-brand-secondary">
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
