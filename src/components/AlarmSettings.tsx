import React from 'react';
import { Box, FormGroup, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
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
            [key]: event.target.value === 'true'
        });
    };

    return (
        <>
            <Box sx={{ marginBottom: '16px' }}>
                <SectionHeader title="Alarm" />
            </Box>
            <FormGroup>
                <Typography variant="body1">Do you want to get alarm when selected category has new article?</Typography>
                <RadioGroup
                    row
                    value={preferences.alarm !== undefined ? preferences.alarm.toString() : 'false'}
                    onChange={e => handlePreferenceChange(e, 'alarm')}
                >
                    <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Heck Yeah!"
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No Thanks"
                    />
                </RadioGroup>
                <Typography variant="body1" sx={{ mt: 2 }}>We can also send you emails by subscribing our site (and it’s FREE!)</Typography>
                <RadioGroup
                    row
                    value={preferences.emailUpdates !== undefined ? preferences.emailUpdates.toString() : 'false'}
                    onChange={e => handlePreferenceChange(e, 'emailUpdates')}
                >
                    <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Subscribe"
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No Thanks"
                    />
                </RadioGroup>
            </FormGroup>
        </>
    );
};

export default AlarmSettings;
