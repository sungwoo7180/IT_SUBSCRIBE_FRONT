import React, { useState, useEffect, MouseEvent } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
    IconButton, CircularProgress, MenuItem, Menu, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Pagination, Grid, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import axiosInstance from '../config/AxiosConfig';
import Navbar from '../components/Navbar';
import { styled } from "@mui/system";

interface StatusOption {
    name: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'REJECTED' | 'APPROVED'; // Enum으로 지정
    description: string;
}

interface ReportedComment {
    commentId: number;
    commentContent: string;
    articleId: number;
    commentator: {
        id: number;
        userName: string;
    };
    reporter: {
        id: number;
        userName: string;
    };
    reportId: number;
    reportDate: string;
    reason: string;
    status: '대기중' | '처리중' | '반려' | '승인';
}

const AdminContainer = styled(Box)({

});

const AdminReportedComments: React.FC = () => {
    const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [statuses, setStatuses] = useState<StatusOption[]>([]);
    const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedStatus, setSelectedStatus] = useState<StatusOption['name'] | null>(null);
    const [statusTargetId, setStatusTargetId] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filterStatus, setFilterStatus] = useState<'ALL' | StatusOption['name']>('ALL'); // 필터 상태
    const [selectedCommentDetails, setSelectedCommentDetails] = useState<ReportedComment | null>(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
    const [banDays, setBanDays] = useState<number>(1);
    const [isBanning, setIsBanning] = useState<boolean>(false);
    const [banReason, setBanReason] = useState<string>('');

    const fetchReportedComments = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/admin/reports`, {
                params: {
                    page: page - 1,
                    status: filterStatus === 'ALL' ? null : filterStatus
                }
            });
            setReportedComments(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch reported comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportedComments();
        const fetchStatuses = async () => {
            try {
                const response = await axiosInstance.get('/api/enum-list/comment-statuses');
                setStatuses(response.data);
            } catch (error) {
                console.error('Failed to fetch statuses:', error);
            }
        };
        fetchStatuses();
    }, [page, filterStatus]); // 페이지와 필터 상태에 따라 데이터 새로고침

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleRowClick = async (commentId: number) => {
        try {
            const response = await axiosInstance.get(`/api/admin/report/${commentId}`);
            setSelectedCommentDetails(response.data);
            setOpenDetailsDialog(true);
        } catch (error) {
            console.error('Failed to fetch comment details:', error);
        }
    };

    const handleDeleteClick = (commentId: number) => {
        setSelectedCommentId(commentId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedCommentId !== null) {
            try {
                await axiosInstance.delete(`/api/admin/report/${selectedCommentId}`);
                setReportedComments((prevComments) =>
                    prevComments.filter((comment) => comment.reportId !== selectedCommentId)
                );
                setOpenDeleteDialog(false);
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        }
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleStatusClick = (event: MouseEvent<HTMLElement>, commentId: number) => {
        event.stopPropagation(); // 클릭 이벤트 전파 방지
        setStatusTargetId(commentId);
        setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusChange = async (statusName: StatusOption['name']) => {
        if (statusTargetId !== null) {
            try {
                await axiosInstance.put(`/api/admin/report/${statusTargetId}`, { status: statusName });
                setReportedComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.reportId === statusTargetId
                            ? { ...comment, status: statuses.find(status => status.name === statusName)?.description as ReportedComment['status'] || '대기중' }
                            : comment
                    )
                );
                setStatusAnchorEl(null);
                setStatusTargetId(null);
            } catch (error) {
                console.error('Failed to update comment status:', error);
            }
        }
    };

    const handleStatusClose = () => {
        setStatusAnchorEl(null);
    };

    const handleFilterClick = (event: MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget); // 필터 메뉴를 열기 위한 설정
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterChange = async (statusName: StatusOption['name']) => {
        if (statusName === 'ALL') {
            setFilterStatus('ALL');
        } else {
            setFilterStatus(statusName);
        }
        setPage(1); // 첫 페이지로 이동
        setFilterAnchorEl(null); // 메뉴 닫기
    };

    // 유저 정지 함수
    const handleBanUser = async (reportId: number, userId: number) => {
        setIsBanning(true);
        try {
            await axiosInstance.post(`/api/admin/user/ban`, {
                reportId: reportId,
                userId: userId,
                days: banDays,
                reason: banReason
            });
            // 성공 메시지 표시
            alert(`User ${userId} has been banned for ${banDays} days.`);
            setOpenDetailsDialog(false);

            // 데이터 다시 불러오기
            await fetchReportedComments();
        } catch (error) {
            console.error('Failed to ban user:', error);
            alert('Failed to ban user. Please try again.');
        } finally {
            setIsBanning(false);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1f2a3c' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Helper function to truncate text with ellipsis
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <AdminContainer>
            <Navbar /> {/* Navbar 추가 */}
            <Box sx={{ p: 3, backgroundColor: '#1f2a3c', minHeight: '100vh', color: 'white' }}>

                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    Reported Comments
                </Typography>

                <Paper elevation={3} sx={{ backgroundColor: '#2a3b4c', color: 'white', p: 2 }}>
                    <TableContainer component={Paper} sx={{ backgroundColor: '#1f2a3c' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>Report ID</TableCell>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>Comment</TableCell>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>Reason</TableCell>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>Timestamp</TableCell>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>
                                        Status
                                        <IconButton onClick={handleFilterClick} sx={{ ml: 1 }}>
                                            <FilterListIcon sx={{ color: 'white' }} />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', whiteSpace: 'nowrap' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportedComments.map((comment) => (
                                    <TableRow
                                        key={comment.reportId}
                                        onClick={(event) => {
                                            // 상태 칩이나 삭제 버튼을 클릭한 경우 상세 정보 대화상자를 열지 않음
                                            if (!(event.target as HTMLElement).closest('.MuiChip-root, .MuiIconButton-root')) {
                                                handleRowClick(comment.reportId);
                                            }
                                        }}
                                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#2a3b4c' } }}
                                    >
                                        <TableCell sx={{ color: 'white' }}>{comment.reportId}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {truncateText(comment.commentContent, 20)}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{comment.reason}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{new Date(comment.reportDate).toLocaleString()}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={comment.status}
                                                color={
                                                    comment.status === '대기중' ? 'warning' :
                                                        comment.status === '처리중' ? 'info' :
                                                            comment.status === '반려' ? 'error' :
                                                                'success'
                                                }
                                                onClick={(event) => handleStatusClick(event, comment.reportId)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                            <Menu
                                                anchorEl={statusAnchorEl}
                                                open={Boolean(statusAnchorEl) && statusTargetId === comment.reportId}
                                                onClose={handleStatusClose}
                                                sx={{
                                                    '& .MuiPaper-root': {
                                                        backgroundColor: '#2a3b4c',
                                                    }
                                                }}
                                            >
                                                {statuses.map((status) => (
                                                    <MenuItem
                                                        key={status.name}
                                                        onClick={(event) => {
                                                            event.stopPropagation(); // 이벤트 전파 중단
                                                            handleStatusChange(status.name);
                                                        }}
                                                        sx={{
                                                            color: 'white',
                                                            backgroundColor: '#2a3b4c',
                                                            '&:hover': {
                                                                backgroundColor: '#1f2a3c',
                                                            }
                                                        }}
                                                    >
                                                        {status.description}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <IconButton
                                                color="error"
                                                onClick={(event) => {
                                                    event.stopPropagation(); // 클릭 이벤트 전파 방지
                                                    handleDeleteClick(comment.reportId);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        sx={{ mt: 2, color: 'white' }}
                    />
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    sx={{ '& .MuiDialog-paper': { backgroundColor: '#2a3b4c', color: 'white' } }}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>Are you sure you want to delete this comment?</DialogContent>
                    <DialogContent>해당 댓글 내역과 유저의 정지 기록이 완전히 삭제됩니다.</DialogContent>

                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Details Dialog */}
                <Dialog
                    open={openDetailsDialog}
                    onClose={() => setOpenDetailsDialog(false)}
                    maxWidth="md"
                    fullWidth
                    sx={{ '& .MuiDialog-paper': { backgroundColor: '#2a3b4c', color: 'white' } }}
                >
                    <DialogTitle sx={{ borderBottom: '1px solid #ffffff3d', pb: 2 }}>
                        Comment Details
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedCommentDetails && (
                            <Box>
                                <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#1f2a3c' }}>
                                    <Typography variant="h6" gutterBottom>Comment Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Comment ID</Typography>
                                            <Typography variant="body1">{selectedCommentDetails.commentId}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Article ID</Typography>
                                            <Typography variant="body1">{selectedCommentDetails.articleId}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="text.secondary">Content</Typography>
                                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                {selectedCommentDetails.commentContent}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#1f2a3c' }}>
                                    <Typography variant="h6" gutterBottom>Report Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Report ID</Typography>
                                            <Typography variant="body1">{selectedCommentDetails.reportId}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Report Date</Typography>
                                            <Typography variant="body1">
                                                {new Date(selectedCommentDetails.reportDate).toLocaleString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                                            <Typography variant="body1">{selectedCommentDetails.reason}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                            <Typography variant="body1">{selectedCommentDetails.status}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#1f2a3c' }}>
                                    <Typography variant="h6" gutterBottom>User Information</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Commentator</Typography>
                                            <Typography variant="body1">
                                                ID: {selectedCommentDetails.commentator.id},
                                                Username: {selectedCommentDetails.commentator.userName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Reporter</Typography>
                                            <Typography variant="body1">
                                                ID: {selectedCommentDetails.reporter.id},
                                                Username: {selectedCommentDetails.reporter.userName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Ban User Section */}
                                <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1f2a3c' }}>
                                    <Typography variant="h6" gutterBottom>Ban User</Typography>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Reason"
                                                value={banReason}
                                                onChange={(e) => setBanReason(e.target.value)}
                                                fullWidth
                                                sx={{ backgroundColor: '#2a3b4c', input: { color: 'white' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="day"
                                                type="number"
                                                value={banDays}
                                                onChange={(e) => setBanDays(Number(e.target.value))}
                                                InputProps={{ inputProps: { min: 1 } }}
                                                fullWidth
                                                sx={{ backgroundColor: '#2a3b4c', input: { color: 'white' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleBanUser(selectedCommentDetails?.reportId, selectedCommentDetails.commentator.id)}
                                                disabled={isBanning}
                                                fullWidth
                                            >
                                                {isBanning ? 'Banning...' : 'Ban User'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ borderTop: '1px solid #ffffff3d', pt: 2 }}>
                        <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Filter Menu */}
                <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: '#2a3b4c',
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => handleFilterChange('ALL')}
                        sx={{
                            color: 'white',
                            backgroundColor: '#2a3b4c',
                            '&:hover': {
                                backgroundColor: '#1f2a3c',
                            }
                        }}
                    >
                        All
                    </MenuItem>
                    {statuses.map((status) => (
                        <MenuItem
                            key={status.name}
                            onClick={() => handleFilterChange(status.name)}
                            sx={{
                                color: 'white',
                                backgroundColor: '#2a3b4c',
                                '&:hover': {
                                    backgroundColor: '#1f2a3c',
                                }
                            }}
                        >
                            {status.description}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </AdminContainer>
    );
};

export default AdminReportedComments;
