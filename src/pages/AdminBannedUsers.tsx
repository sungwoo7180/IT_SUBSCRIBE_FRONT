import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axiosInstance from '../config/AxiosConfig';
import Navbar from '../components/Navbar';
import { styled } from "@mui/system";

interface BanDTO {
    banId: number;
    username: string;
    reportId: number;
    banStartDate: string;
    banEndDate: string;
    reason: string;
    active: boolean;
}

const AdminContainer = styled(Box)({
    padding: '20px',
    backgroundColor: '#1f2a3c',
    minHeight: '100vh',
    color: 'white',
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
};

const AdminBannedUsers: React.FC = () => {
    const [banList, setBanList] = useState<BanDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBan, setSelectedBan] = useState<BanDTO | null>(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

    // 정지된 유저 리스트를 가져오는 함수
    const fetchBanList = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/admin/user/ban-list');
            setBanList(response.data);
        } catch (error) {
            console.error('Failed to fetch banned users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanList();
    }, []);

    const handleRowClick = (ban: BanDTO) => {
        setSelectedBan(ban);
        setOpenDetailsDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDetailsDialog(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1f2a3c' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AdminContainer>
            <Navbar /> {/* Navbar 추가 */}
            <Box sx={{ p: 3, backgroundColor: '#1f2a3c' }}>
                <Typography variant="h4" gutterBottom>
                    정지된 유저 리스트
                </Typography>

                <Paper elevation={3} sx={{ backgroundColor: '#2a3b4c', color: 'white', p: 2 }}>
                    <TableContainer component={Paper} sx={{ backgroundColor: '#1f2a3c' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Ban ID</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Username</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Report ID</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Start Date</TableCell>
                                    <TableCell sx={{ color: 'white' }}>End Date</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Reason</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Active</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {banList.map((ban) => (
                                    <TableRow
                                        key={ban.banId}
                                        onClick={() => handleRowClick(ban)}
                                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#2a3b4c' } }}
                                    >
                                        <TableCell sx={{ color: 'white' }}>{ban.banId}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{ban.username}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{ban.reportId}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{formatDate(ban.banStartDate)}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{formatDate(ban.banEndDate)}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{ban.reason}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{ban.active ? 'Yes' : 'No'}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleRowClick(ban)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Details Dialog */}
                <Dialog
                    open={openDetailsDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    sx={{ '& .MuiDialog-paper': { backgroundColor: '#2a3b4c', color: 'white' } }}
                >
                    <DialogTitle>Ban Details</DialogTitle>
                    <DialogContent>
                        {selectedBan && (
                            <Box>
                                <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#1f2a3c' }}>
                                    <Typography variant="h6" gutterBottom>User Information</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                                    <Typography variant="body1">{selectedBan.username}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Report ID</Typography>
                                    <Typography variant="body1">{selectedBan.reportId}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Ban Start Date</Typography>
                                    <Typography variant="body1">{formatDate(selectedBan.banStartDate)}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Ban End Date</Typography>
                                    <Typography variant="body1">{formatDate(selectedBan.banEndDate)}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                                    <Typography variant="body1">{selectedBan.reason}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Active</Typography>
                                    <Typography variant="body1">{selectedBan.active ? 'Yes' : 'No'}</Typography>
                                </Paper>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminContainer>
    );
};

export default AdminBannedUsers;
