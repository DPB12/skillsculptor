import { ToggleSwitch } from 'flowbite-react';
import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeMode = ({ setThemeChange }) => {
    const { switch1, changeTheme, availableColors, primaryColor, changeColor, theme } = useTheme();

    useEffect(() => {
        setThemeChange({
            mode: theme,
            color: primaryColor
        });
    }, [theme, primaryColor]);

    return (
        <div className="flex flex-col items-center">
            <ToggleSwitch
                className='flex flex-row-reverse items-center gap-5 mb-4'
                checked={switch1}
                label="Modo oscuro"
                onChange={changeTheme} 
            />
            <div className="flex gap-2">
                {availableColors.map((color, index) => (
                    <div
                        key={index} 
                        className={`w-8 h-8 cursor-pointer border-2 rounded-full border-gray-300 transition-transform duration-300 
                        ${primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''} 
                        ${color.bg}`}
                        onClick={() => changeColor(color)}
                    ></div>
                ))}
            </div>
        </div>
    );
};
