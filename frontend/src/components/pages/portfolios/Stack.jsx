import React from 'react';
import { useIcons } from '../../../hooks/useIcons';

export const Stack = ({ languages }) => {

    const iconsMap = useIcons();

    return (
        <div className="flex flex-wrap justify-center mt-5">
            {languages.map((language) => (
                <div key={language} className="text-5xl m-2">
                    {iconsMap[language]} 
                </div>
            ))}
        </div>
    );
};