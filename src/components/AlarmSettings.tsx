import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import SectionHeader from "./SectionHeader";

interface AlarmSettingsProps {
    preferences: {
        alarm: boolean;
        emailUpdates: boolean;
    };
    setPreferences: (preferences: AlarmSettingsProps['preferences']) => void;
}

const AlarmSettings: React.FC<AlarmSettingsProps> = ({ preferences, setPreferences }) => {
    const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>, key: keyof AlarmSettingsProps['preferences']) => {
        setPreferences({
            ...preferences,
            [key]: event.target.checked
        });
    };

    return (
        <>
            <Box sx={{ marginBottom: '16px' }}>
                <SectionHeader title="Alarm" />
            </Box>
            <FormGroup>
                <Typography variant="body1">Do you want to get alarm when selected category has new article?</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                    <FormControlLabel
                        control={<Checkbox checked={preferences.alarm} onChange={e => handlePreferenceChange(e, 'alarm')} />}
                        label="Heck Yeah!"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={!preferences.alarm} onChange={e => handlePreferenceChange(e, 'alarm')} />}
                        label="No Thanks"
                    />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>We can also send you emails by subscribing our site (and it’s FREE!)</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5.5 }}>
                    <FormControlLabel
                        control={<Checkbox checked={preferences.emailUpdates} onChange={e => handlePreferenceChange(e, 'emailUpdates')} />}
                        label="Subscribe"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={!preferences.emailUpdates} onChange={e => handlePreferenceChange(e, 'emailUpdates')} />}
                        label="No Thanks"
                    />
                </Box>
            </FormGroup>
        </>
    );
};

export default AlarmSettings;
