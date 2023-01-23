const color = {
    appBg: '#E0E0E0',
    font: '#333333',
    placeholder: '#999999',
    info: '#E6F3F5',
    error: '#FDDEE6',
    warning: '#FCE9B5',
    dark: '#025e84',
    primary: '#00a5a5',
    secondary: '#CCCCCC',
    btnPrimary: '',
    btnSecondary: '',
    focus: '',
    link: '#009FD4',
    border: '#999999', // #E2DDDA
};

const space = {
    smallest: 6,
    small: 12,
    medium: 24,
    large: 36,
};

const border = {
    color: color.border,
    radius: 4,
};

const font = {
    color: color.fond,
    smallest: 10,
    small: 14,
    regular: 18,
    medium: 22,
    large: 26,
    larger: 30,
    largest: 34,
};

const shadow = {
    level0: {
        shadowColor: 'transparent',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    level1: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    level2: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.24,
        shadowRadius: 6.27,
        elevation: 2,
    },
    level3: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.36,
        shadowRadius: 12.35,
        elevation: 6,
    },
};

const Styling = {
    space,
    color,
    border,
    font, 
    shadow,
    wrapper: {
        padding: space.medium,        
    },
    stretch: {
        paddingLeft: space.medium * -1,
        paddingRight: space.medium * -1,
    }
};

export default Styling;