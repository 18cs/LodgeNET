using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace LodgeNET.API.ConfigHelpers
{
    /// <summary>
    /// Provides static methods to combine expressions with logical AND/OR conditions
    /// </summary>
    public static class ExpressionCombiner
    {
        #region Static Methods
        /// <summary>
        /// Combines two expressions with a logical AND
        /// </summary>
        /// <typeparam name="TInput"></typeparam>
        /// <param name="func1">First function expression</param>
        /// <param name="func2">Second function expression</param>
        /// <returns>Combined expression</returns>
        public static Expression<Func<TInput, bool>> CombineWithAndAlso<TInput>(this Expression<Func<TInput, bool>> func1, Expression<Func<TInput, bool>> func2)
        {
            return Expression.Lambda<Func<TInput, bool>>(
                Expression.AndAlso(
                    func1.Body, new ExpressionParameterReplacer(func2.Parameters, func1.Parameters).Visit(func2.Body)),
                func1.Parameters);
        }

        /// <summary>
        /// Combines two expressions with a logical OR
        /// </summary>
        /// <typeparam name="TInput"></typeparam>
        /// <param name="func1">First function expression</param>
        /// <param name="func2">Second function expression</param>
        /// <returns></returns>
        public static Expression<Func<TInput, bool>> CombineWithOrElse<TInput>(this Expression<Func<TInput, bool>> func1, Expression<Func<TInput, bool>> func2)
        {
            return Expression.Lambda<Func<TInput, bool>>(
                Expression.AndAlso(
                    func1.Body, new ExpressionParameterReplacer(func2.Parameters, func1.Parameters).Visit(func2.Body)),
                func1.Parameters);
        }
        #endregion

        #region ExpressionParameterReplacerClass
        /// <summary>
        /// Maps the parameters of two expressions, allowing for easy access
        /// </summary>
        private class ExpressionParameterReplacer : ExpressionVisitor
        {
            /// <summary>
            /// Stores parameters of provided expressions
            /// </summary>
            private IDictionary<ParameterExpression, ParameterExpression> ParameterReplacements { get; set; }

            /// <summary>
            /// Constructor; Maps the parameters of two expressions in dictionary
            /// </summary>
            /// <param name="fromParameters">Parameters are taken from</param>
            /// <param name="toParameters">Parameters are places into</param>
            public ExpressionParameterReplacer(IList<ParameterExpression> fromParameters, IList<ParameterExpression> toParameters)
            {
                ParameterReplacements = new Dictionary<ParameterExpression, ParameterExpression>();
                for (int i = 0; i != fromParameters.Count && i != toParameters.Count; i++)
                    ParameterReplacements.Add(fromParameters[i], toParameters[i]);
            }

            /// <summary>
            /// node is key to find parameters that was mapped to it
            /// node is then replaced with value from dictionary
            /// </summary>
            /// <param name="node">parameter to be replaced</param>
            /// <returns></returns>
            protected override Expression VisitParameter(ParameterExpression node)
            {
                ParameterExpression replacement;
                if (ParameterReplacements.TryGetValue(node, out replacement))
                    node = replacement;
                return base.VisitParameter(node);
            }
        }
        #endregion
    }
}
