interface StatusBadgeProps {
  status: string;
  type?: 'product' | 'order' | 'payment' | 'provider';
}

export function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  let bgColor = '';
  let textColor = '';

  if (type === 'product') {
    bgColor = status === 'ACTIVE' ? 'bg-green-100' : 'bg-gray-100';
    textColor = status === 'ACTIVE' ? 'text-green-800' : 'text-gray-800';
  } else if (type === 'order') {
    if (status === 'PENDING') {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (status === 'PAID') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }
  } else if (type === 'payment') {
    if (status === 'PENDING') {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (status === 'SUCCESS') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }
  } else if (type === 'provider') {
    bgColor = status === 'STRIPE' ? 'bg-blue-100' : 'bg-pink-100';
    textColor = status === 'STRIPE' ? 'text-blue-800' : 'text-pink-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
