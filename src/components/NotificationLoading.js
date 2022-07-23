import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export default function NotificationLoading() {
    return (
        <SkeletonContent 
            containerStyle={{ flex: 1, alignSelf: 'center', marginTop: 30, borderRadius: 8, width: '100%' }}
            animationDirection="horizontalRight"
            layout={[
                { height: 200, width: '100%', borderRadius: 8, alignSelf: 'center' },
            ]}
            isLoading={true}
            boneColor="#121212"
            highlightColor="#333333"
        />
    )
}